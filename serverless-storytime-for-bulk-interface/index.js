const aws = require('aws-sdk');
const path = require('path');

const sns = new aws.SNS();

const tableName = "dynamodb-storytime";
const dynamo = new aws.DynamoDB.DocumentClient();

const topicArn = process.env.topicArn;

exports.handler = async (event, context) => {
    // console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env));
    // console.log('## EVENT: ' + JSON.stringify(event));
    
    // console.log('## EVENT: ' + JSON.stringify(event.params));
    // console.log('## EVENT: ' + JSON.stringify(event.context));
    var message = "";
    
    var body = Buffer.from(event['body-json'], 'base64');
    console.log('body: '+body);

    const eventInfo = JSON.parse(body);

    for(i=0;i<eventInfo.length;i++) {
        console.log(eventInfo[i].Id);
        console.log(eventInfo[i].Timestamp);

        var id = eventInfo[i].Id;
        var timestamp = eventInfo[i].Timestamp;
    
        var id, timestamp;  
        var origName="", origURL="", downURL="";

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

        origName = dynamoGet.Item.Info.OrigName;
        origURL = dynamoGet.Item.Info.OrigURL;
        downURL = dynamoGet.Item.Info.DownURL;

        if(downURL) {
            message += ('Original Image: '+origName+' url: '+origURL+'\nMP3 url: '+downURL+'\n\n');
        }  
    }
    
    if(message == ""){
        const response = {
            statusCode: 404,
        };
        return response;
    }
    else {
        // publish to SNS
        console.log('start sns: ' + id);   
        var snsParams = {
            Subject: 'Get your voice stories',
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

    const response = {
        statusCode: 200,
        body: message
    };
    return response;
};