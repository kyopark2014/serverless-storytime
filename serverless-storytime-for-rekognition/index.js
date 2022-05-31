const aws = require('aws-sdk');
var sqs = new aws.SQS({apiVersion: '2012-11-05'});
const tableName = "dynamodb-storytime";
const dynamo = new aws.DynamoDB.DocumentClient();
const rekognition = new aws.Rekognition();

const sqsRekognitionUrl = process.env.sqsRekognitionUrl;
const sqsPollyUrl= process.env.sqsPollyUrl;
const sqsOpensearchUrl = process.env.sqsOpensearchUrl;

exports.handler = async (event) => {
    // console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env));
    // console.log('## EVENT: ' + JSON.stringify(event))
    
    const receiptHandle = event['Records'][0]['receiptHandle'];
    // console.log('receiptHandle: '+receiptHandle);
    
    const body = event['Records'][0]['body'];
    // console.log('body = '+body);

    const obj = JSON.parse(body);
    const id = obj.Id;
    const timestamp = obj.Timestamp;
    const bucket = obj.Bucket;
    const key = obj.Key;
    const needNoti = obj.NeedNoti;
    const needDupChk = obj.NeedDupChk;
    const startEventTime = obj.StartEventTime;
    var origName = obj.OrigName;
    var jsonData = obj.JsonData;
    var textData = obj.TextData;
    var downURL = obj.DownURL;

    var elapsedTimeforRekognition = 0;

    if(!jsonData || !needDupChk) {
        var startTime = new Date().getTime();
        console.log('start rekognition: ' + id);
        
        const rekognitionParams = {
            Image: {
                S3Object: {
                    Bucket: bucket,
                    Name: key
                },
            },
        };
        console.log('rekognitionParams = '+JSON.stringify(rekognitionParams));

        try {
            let data = await rekognition.detectText(rekognitionParams).promise();
            console.log('rekognition result: '+JSON.stringify(data)); 

            // update event info into dynamoDB
            console.log('update event status to dynamo');
            jsonData = JSON.stringify(data);
            var updateParams = {
                TableName: tableName,
                Key: {
                    Id: id,
                    Timestamp: timestamp
                },
                UpdateExpression: "set Info.JsonData = :json",
                ExpressionAttributeValues: {
                    ":json": jsonData
                }
            };

            var current = new Date();      
            elapsedTimeforRekognition = Math.floor((current.getTime() - startTime)/10)/100;
            console.log('finish rekognition: ' + id);
            console.log('elapsedTimeforRekognition: '+elapsedTimeforRekognition);
            
            var dynamoUpdate; 
            try {
                dynamoUpdate = await dynamo.update(updateParams).promise();
            } catch (error) {
                console.log(error);
                return;
            } 
        } catch (error) {
            console.log(error);
            return error;
        } 
    }
    else {
        console.log('skip Rekognition: '+id);
    }
    
    // remove message queue 
    try {
        var deleteParams = {
            QueueUrl: sqsRekognitionUrl,
            ReceiptHandle: receiptHandle
        };

        console.log('remove messageQueue: ' + id);
        sqs.deleteMessage(deleteParams, function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
            //    console.log("Success to remove messageQueue: "+id+", deleting messagQueue: ", data.ResponseMetadata.RequestId);
            }
        });
    } catch (err) {
        console.log(err);
    }

    // push the Json file to to SQS 
    var sqsParams = {
        DelaySeconds: 10,
        MessageAttributes: {},
        MessageBody: JSON.stringify({
            Id: id,
            Timestamp: timestamp,
            Bucket: bucket,
            OrigName: origName,
            OrigKey: key,
            NeedNoti: needNoti,
            NeedDupChk: needDupChk,
            StartEventTime: startEventTime,
            JsonData: jsonData,
            TextData: textData,
            DownURL: downURL
        }),  
        QueueUrl: sqsPollyUrl                       
    };
    
    console.log('sqsParams: '+JSON.stringify(sqsParams));
    console.log('start sqs for polly: ' + id);
    
    try {
        let result = await sqs.sendMessage(sqsParams).promise();   
        console.log('result:'+JSON.stringify(result));
        
        console.log('finish sqs for polly: ' + id);
    } catch (err) {
        console.log(err);
    } 

    current = new Date();      
    var diff = Math.floor((current.getTime() - startEventTime)/10)/100;
    console.log('elapsedTime: '+diff +', id='+id);

    // for logging
    const opensearchInfo = {
        From: 'rekognition',
        Id: id,
        ElapsedTimeforRekognition: elapsedTimeforRekognition
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

    const response = {
        statusCode: 200,
    //    body: JSON.stringify(data)
    };
    return response;
};
