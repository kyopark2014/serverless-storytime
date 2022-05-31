const aws = require('aws-sdk');
const cd = require('content-disposition');
const {v4: uuidv4} = require('uuid');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
var sqs = new aws.SQS({apiVersion: '2012-11-05'});
const sns = new aws.SNS();

var crypto = require('crypto');

const tableName = "dynamodb-storytime";
const indexName = "ContentID-index"; // GSI
const dynamo = new aws.DynamoDB.DocumentClient();

const path = require('path');

const sqsRekognitionUrl = process.env.sqsRekognitionUrl;
const sqsOpensearchUrl = process.env.sqsOpensearchUrl;
const topicArn = process.env.topicArn;
const bucket = process.env.bucket;

exports.handler = async (event, context) => {
    // console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env))
    // console.log('## EVENT: ' + JSON.stringify(event))
    
    const body = Buffer.from(event["body-json"], "base64");
    // console.log('## EVENT: ' + JSON.stringify(event.params))
    // console.log('## EVENT: ' + JSON.stringify(event.context))

    var id, timestamp, ext, key;  
    var origName="", jsonData="", textData="", origURL="", downURL="";

    var contentType;
    if(event.params.header['Content-Type']) {
        contentType = event.params.header["Content-Type"];
    } 
    else if(event.params.header['content-type']) {
        contentType = event.params.header["content-type"];
    }
    // console.log('contentType = '+contentType); 

    var contentDisposition;
    if(event.params.header['Content-Disposition']) {
        contentDisposition = event.params.header["Content-Disposition"];  
    } 
    else if(event.params.header['content-disposition']) {
        contentDisposition = event.params.header["content-disposition"];  
    }
    // console.log('disposition = '+contentDisposition);

    if(contentDisposition) {
      origName = cd.parse(contentDisposition).parameters.filename;

      ext = path.parse(origName).ext;
    }

    var needNoti = true;
    if(event.params.header['X-notification-required']) {
      needNoti = (event.params.header["X-notification-required"] == 'true');
    }  
    else if(event.params.header['x-notification-required']) {
      needNoti = (event.params.header["x-notification-required"] == 'true');
    }     
    // console.log('Need Notification: '+needNoti);

    var needDupChk = true;  // for load test
    if(event.params.header['X-duplication-check-required']) {
      needDupChk = (event.params.header["X-duplication-check-required"] == 'true');
    }
    else if(event.params.header['x-duplication-check-required']) {
      needDupChk = (event.params.header["x-duplication-check-required"] == 'true');
    }
    console.log('Need Duplication Check: '+needDupChk);

    if(!ext) {
      if(contentType == 'image/jpeg') ext = '.jpeg';
      else if(contentType == 'image/jpg') ext = '.jpg';
      else if(contentType == 'image/png') ext = '.png';
      else ext = '.jpeg';  // default
    }
    // console.log('ext: ', ext);

    var startEventTime = new Date().getTime();        
    const logData = {
      StartEventTime: startEventTime,
      Filename: origName,
      // Ext: ext,
      // ContentType: contentType,
      NeedNoti: needNoti,
      NeedDupChk: needDupChk,
    };
    console.log('requestInfo: '+JSON.stringify(logData));

    // extract fingerprint from the given image using hashing 
    console.log('start hashing');
    let fingerprint = "";
    try {
      const hashSum = crypto.createHash('sha256');    
      hashSum.update(body);      
      fingerprint = hashSum.digest('hex');
      
      console.log('finish hashing: fingerprint = '+fingerprint);
    } catch(error) {
      console.log(error);
      return;
    }

    // check the duplication of the given image
    var queryParams = {
      TableName: tableName,
      IndexName: indexName,    
      KeyConditionExpression: "ContentID = :contentID",
      ExpressionAttributeValues: {
          ":contentID": fingerprint
      }
    };

    var dynamoQuery; 
    try {
      dynamoQuery = await dynamo.query(queryParams).promise();

    //  console.log('queryDynamo: '+JSON.stringify(dynamoQuery));
      console.log('queryDynamo: '+dynamoQuery.Count);      
    } catch (error) {
      console.log(error);
      return;
    } 

    if(dynamoQuery.Count == 0 || !needDupChk) {  // new file
      id = uuidv4(); // generate uuid
      key = id+ext;
      if(!origName) {
        origName = id+ext;
      } 

      var date = new Date();        
      timestamp = Math.floor(date.getTime()/1000).toString();

      // putObject to S3
      console.log('start upload: ' + id);
      try {
          const destparams = {
              Bucket: bucket, 
              Key: key,  // use uuid for filename in order to escape duplicated filename 
              Body: body,
              ContentType: contentType
          };
          const {putResult} = await s3.putObject(destparams).promise(); 
  
          console.log('finish upload: ' + id);
      } catch (error) {
          console.log(error);
          return;
      } 

      // putItem to DynamoDB
      var putParams = {
        TableName: tableName,
        Item: {
          Id: id,
          Timestamp: timestamp,  // start time
          ContentID: fingerprint,
          Info:{
            OrigName: origName, // original given filename
            ContentType: contentType,
            JsonData: jsonData,
            TextData: textData,
            OrigURL: origURL,
            DownURL: downURL
          }
        } 
      };
      // console.log("putParms: "+JSON.stringify(putParams));
     
      try {
        const dynomoPut = await dynamo.put(putParams).promise();
      } catch (error) {
        console.log(error);
        return;
      } 
    }
    else {
      console.log('Duplicated ContentID: '+JSON.stringify(dynamoQuery.Items[0]));

      id = dynamoQuery.Items[0].Id;
      timestamp = dynamoQuery.Items[0].Timestamp;

      if(!id || !timestamp) { 
        id = uuidv4(); // generate uuid
        key = id+ext;
        if(!origName) {
          origName = id+ext;
        } 
  
        var date = new Date();        
        timestamp = Math.floor(date.getTime()/1000).toString();
      }
      
      jsonData = dynamoQuery.Items[0].Info.JsonData;
      textData = dynamoQuery.Items[0].Info.TextData;
      origURL = dynamoQuery.Items[0].Info.OrigURL;
      downURL = dynamoQuery.Items[0].Info.DownURL;
      
      const fileInfo = path.parse(origURL);
      key = fileInfo.name + fileInfo.ext;
      
      console.log('id: '+id);
      console.log('timestamp: '+timestamp);
      console.log('key: ', key);      
      console.log('origName: '+origName);
      console.log('textData: '+textData);
      console.log('origURL: '+origURL);
      console.log('downURL: '+downURL);
    } 
    
    if(!downURL || !needDupChk) { // push the event into SQS      
      const eventInfo = {
        Id: id,
        Timestamp: timestamp,
        StartEventTime: startEventTime,
        Bucket: bucket, 
        Key: key,
        NeedNoti: needNoti,
        NeedDupChk: needDupChk,
        OrigName: origName,
        JsonData: jsonData,
        TextData: textData,
        DownURL: downURL        
      };     
      const sqsParams = {
        DelaySeconds: 10,
        MessageAttributes: {},
        MessageBody: JSON.stringify(eventInfo), 
        QueueUrl: sqsRekognitionUrl
      };  
      console.log('sqsParams: '+JSON.stringify(sqsParams));

      try {
        let sqsResponse = await sqs.sendMessage(sqsParams).promise();  
        // console.log("sqsResponse: "+JSON.stringify(sqsResponse));
      } catch (err) {
        console.log(err);
      } 
    }
    else {  // if the processing of the image was already finished, push to SNS
      // publish to SNS
      const message = 'Original Image: '+origName+' url: '+origURL+'\nMP3 url: '+downURL+'\n\n'+textData;

      console.log('start sns: ' + id);   
      var snsParams = {
          Subject: 'Get your voice story generated from '+origName,
          Message: message,        
          TopicArn: topicArn
      }; 
      console.log('snsParams: '+JSON.stringify(snsParams));
      
      let snsResult;
      try {
          snsResult = await sns.publish(snsParams).promise();
          // console.log('snsResult:', snsResult);

          console.log('finish sns: ' + id);
      } catch (err) {
          console.log(err);
      }
    }

    var current = new Date();      
    var elapsedTimeForUpload = Math.floor((current.getTime() - startEventTime)/10)/100;
    console.log('elapsedTimeForUpload: '+elapsedTimeForUpload);
    
    // for logging
    const opensearchInfo = {
      From: 'upload',
      Id: id,
      ElapsedTimeForUpload: elapsedTimeForUpload,
      DownURL: downURL,
      NeedDupChk: needDupChk
    }; 
    const osqParams = { // opensearch queue params
      DelaySeconds: 10,
      MessageAttributes: {},
      MessageBody: JSON.stringify(opensearchInfo), 
      QueueUrl: sqsOpensearchUrl
    };  
    console.log('osqParams: '+JSON.stringify(osqParams));
    try {
      let sqsResponse = await sqs.sendMessage(osqParams).promise();  
      // console.log("sqsResponse: "+JSON.stringify(sqsResponse));
    } catch (err) {
      console.log(err);
    }

    // for return info
    const fileInfo = {
        Bucket: bucket,
        Key: key,
        Name: origName,
        ID: id,
        NeedNoti: needNoti,
        NeedDupChk: needDupChk,
        Timestamp: timestamp,
        ContentID: fingerprint,
        ContentType: contentType,
        OrigURL: origURL,
        DownURL: downURL
    }; 
    // console.log('file info: ' + JSON.stringify(fileInfo)) 

    const response = {
        statusCode: 200,
        headers: {
          'ETag': id,
          'Timestamp': timestamp
        },
        body: JSON.stringify(fileInfo)
    };
    return response;
};