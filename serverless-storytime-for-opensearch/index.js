const aws = require('aws-sdk');
const sqs = new aws.SQS({apiVersion: '2012-11-05'});

exports.handler = async (event) => {
    // console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env))
    // console.log('## EVENT: ' + JSON.stringify(event))    
    // console.log('## EVENT: ' + JSON.stringify(event.Records[0].body));
    
    const receiptHandle = event['Records'][0]['receiptHandle'];
    
    const body = JSON.parse(event.Records[0].body);
    var id = body.Id; 
    
    if(body.From == "upload") {        
        var elapsedTimeForUpload = body.ElapsedTimeForUpload;
        console.log('elapsedTimeForUpload: '+elapsedTimeForUpload+', id= '+id);
        
        var downURL = body.DownURL;
        var needDupChk = body.NeedDupChk;
        
        console.log("downlink: "+downURL+', dupcheck: '+needDupChk);
        if(downURL && needDupChk) { // duplicated case
            console.log('elapsedTimeforRekognition: '+0+', id: '+id);
            console.log('elapsedTimeforPolly: '+0+', id='+id);
            console.log('elapsedTimeforAll: '+elapsedTimeForUpload+', id: '+id);
        }
    } 
    else if(body.From == "rekognition") {
        var elapsedTimeforRekognition = body.ElapsedTimeforRekognition;
        console.log('elapsedTimeforRekognition: '+elapsedTimeforRekognition+', id: '+id);
    }
    else if(body.From == "polly") {
        var elapsedTimeforPolly = body.ElapsedTimeforPolly;
        console.log('elapsedTimeforPolly: '+elapsedTimeforPolly+', id: '+id);

        var elapsedTimeforAll = body.ElapsedTimeforAll;
        console.log('elapsedTimeforAll: '+elapsedTimeforAll+', id: '+id);
    }

    // delete messageQueue
    console.log('delete messageQueue: ' + id);
    try {
        var deleteParams = {
            QueueUrl: "https://sqs.ap-northeast-2.amazonaws.com/677146750822/sqs-storytime-for-opensearch",
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

    const response = {
        statusCode: 200    
    };
    return response;
};