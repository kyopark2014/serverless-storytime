const aws = require('aws-sdk');
const path = require('path');

var sqs = new aws.SQS({apiVersion: '2012-11-05'});

const tableName = "dynamodb-storytime";
const dynamo = new aws.DynamoDB.DocumentClient();

const bucket = process.env.bucket;
const sqsRekognitionUri = process.env.sqsRekognitionUri;

exports.handler = async (event, context) => {
    console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env))
    console.log('## EVENT: ' + JSON.stringify(event))
    
    console.log('## EVENT: ' + JSON.stringify(event.params))
    console.log('## EVENT: ' + JSON.stringify(event.context))

    var id, ext, key, timestamp;  
    var origName="", jsonData="", textData="", origURL="", downURL="";

    id = event.params.header["ETag"];  
    timestamp = event.params.header["Timestamp"];

    console.log('id: '+id);
    console.log('timestamp: '+timestamp);

    if(!id || !timestamp) {
        const response = {
            statusCode: 400,
            body: "ETag and timestamp are required"
        };
        return response;
    } 

    // retrieve 
    var getParams = {
        TableName: tableName,
        Key: {
            Id: id,
            Timestamp: timestamp
        }
    };

    var dynamoGet; 
    try {
        dynamoGet = await dynamo.get(getParams).promise();

        console.log('get: '+JSON.stringify(dynamoGet));
    } catch (error) {
        console.log(error);
        return;
    }  

    if(dynamoGet.Count == 0) {  // the given Id is not exist
        const response = {
            statusCode: 404,
        };
        return response;
    }
    else {
        origName = dynamoGet.Item.Info.OrigName;
        jsonData = dynamoGet.Item.Info.JsonData;
        textData = dynamoGet.Item.Info.TextData;
        origURL = dynamoGet.Item.Info.OrigURL;
        downURL = dynamoGet.Item.Info.DownURL;
        
        const fileInfo = path.parse(origURL);
        key = fileInfo.name + fileInfo.ext;
        
        console.log('id: '+id);
        console.log('timestamp: '+timestamp);
        console.log('key: ', key);      
        console.log('origName: '+origName);
        console.log('textData: '+textData);
        console.log('origURL: '+origURL);
        console.log('downURL: '+downURL);

        var date = new Date();        
        var current = Math.floor(date.getTime()/1000).toString();
        var diff = current - timestamp;

        console.log('diff: '+diff);

        if(!downURL && diff>60) { // restart after 1min with no result(url)
            // push the event
            const eventInfo = {
                Id: id,
                Timestamp: timestamp,
                Bucket: bucket, 
                Key: key,
                OrigName: origName,
                JsonData: jsonData,
                TextData: textData,
                DownURL: downURL        
            };     
            const sqsParams = {
                DelaySeconds: 10,
                MessageAttributes: {},
                MessageBody: JSON.stringify(eventInfo), 
                QueueUrl: sqsRekognitionUri
            };  
            console.log('sqsParams: '+JSON.stringify(sqsParams));
            
            try {
                let sqsResponse = await sqs.sendMessage(sqsParams).promise();  
                console.log("sqsResponse: "+JSON.stringify(sqsResponse));
            } catch (err) {
                console.log(err);
            } 
        }
    }
    
    if(downURL) {
        const fileInfo = {
            Bucket: bucket,
            Key: key,
            Name: origName,
            ID: id,
            Timestamp: timestamp,
            OrigURL: origURL,
            DownURL: downURL
        }; 
        console.log('file info: ' + JSON.stringify(fileInfo)) 

        const response = {
            statusCode: 200,
            body: JSON.stringify(fileInfo)
        };
        return response;
    }
    else {
        const response = {
            statusCode: 503,
            headers: {
                'Retry-After': 60
            }
        };
        return response;
    }
};