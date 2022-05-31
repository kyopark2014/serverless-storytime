const aws = require('aws-sdk');
const sqs = new aws.SQS({apiVersion: '2012-11-05'});
const sns = new aws.SNS();
const polly = new aws.Polly();
const path = require('path');

const tableName = "dynamodb-storytime";
const dynamo = new aws.DynamoDB.DocumentClient();

const CDN = process.env.CDN; 
const sqsPollyUrl =process.env.sqsPollyUrl;
const sqsOpensearchUrl = process.env.sqsOpensearchUrl;
const topicArn = process.env.topicArn;

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
    const origName = obj.OrigName;
    const needNoti = obj.NeedNoti;
    const needDupChk = obj.NeedDupChk;
    const startEventTime = obj.StartEventTime;
    
    const jsonData = obj.JsonData;
    var textData = obj.TextData;
    const origURL = CDN+obj.OrigKey;
    var downURL = obj.DownURL;

    if(!textData || !needDupChk) {
        console.log('start text extraction: ' + id);
        // text extraction without post processing
        const data = JSON.parse(jsonData);
        for (var i = 0; i < data.TextDetections.length; i++) {
            if(data.TextDetections[i].Type == 'LINE') {
                textData += (data.TextDetections[i].DetectedText+' ');
            }
        }
        console.log('text: '+textData);
        console.log('finish text extraction: ' + id);
    }
    else {
        console.log('skip text extraction');
    }

    if(!downURL || !needDupChk) {
        console.log('start polly: ' + id);
        var startTime = new Date().getTime();   
        
        var polyParams = {
            OutputFormat: "mp3",
            OutputS3BucketName: bucket,
            Text: textData,
            TextType: "text",
            //VoiceId: "Joanna",  // adult women
            VoiceId: "Ivy",  // child girl
            // VoiceId: "Kevin", // child man
            // VoiceId: "Matthew", // adul man
            // Engine: 'standard',
            Engine: "neural",
            // SampleRate: "22050",
        }; 
        
        let pollyResult, key;
        try {
            pollyResult = await polly.startSpeechSynthesisTask(polyParams).promise();       

            console.log('pollyResult:', pollyResult);
            const pollyUrl = pollyResult.SynthesisTask.OutputUri;
            // console.log('url: '+pollyUrl);

            const fileInfo = path.parse(pollyUrl);
            key = fileInfo.name + fileInfo.ext;
            // console.log('key: ', key);

            downURL = CDN+key;
            console.log('finish polly: ' + id); 

            var current = new Date();      
            var elapsedTimeforPolly = Math.floor((current.getTime() - startTime)/10)/100;
            console.log('elapsedTimeforPolly: '+elapsedTimeforPolly);

            // update event info into dynamoDB
            console.log('update event status to dynamo');
            var updateParams = {
                TableName: tableName,
                Key: {
                    Id: id,
                    Timestamp: timestamp
                },
                UpdateExpression: "set Info.TextData=:txt, Info.OrigURL=:orig, Info.DownURL=:down",
                ExpressionAttributeValues: {
                    ":txt": textData,
                    ":orig": origURL,
                    ":down": downURL
                }
            }; 
            
            var dynamoUpdate; 
            try {
                dynamoUpdate = await dynamo.update(updateParams).promise();
            } catch (error) {
                console.log(error);
                return;
            }             
        } catch (err) {
            console.log(err);
        }
    }
    else {
        console.log('skip Polly: '+id);
        console.log('DownURL: '+downURL);
    }

    if(needNoti) {
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
    
    // delete messageQueue
    console.log('delete messageQueue: ' + id);
    try {
        var deleteParams = {
            QueueUrl: sqsPollyUrl,
            ReceiptHandle: receiptHandle
        };

        sqs.deleteMessage(deleteParams, function(err, data) {
            if (err) {
            console.log("Delete Error", err);
            } else {
            // console.log("Success to delete messageQueue: "+id+", deleting messagQueue: ", data.ResponseMetadata.RequestId);
            }
        });
    } catch (err) {
        console.log(err);
    }   

    current = new Date();      
    var elapsedTimeforAll = Math.floor((current.getTime() - startEventTime)/10)/100;
    console.log('elapsedTimeforAll: '+elapsedTimeforAll +', id='+id);

    // for logging
    const opensearchInfo = {
        From: 'polly',
        Id: id,
        ElapsedTimeforPolly: elapsedTimeforPolly,
        ElapsedTimeforAll: elapsedTimeforAll
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

    const fileInfo = {
        Id: id,
        Name: origName,
        Url: downURL
    }; 
    // console.log('File Info: ' + JSON.stringify(fileInfo));

    const response = {
        statusCode: 200,
        body: fileInfo,
    };
    return response;
};
