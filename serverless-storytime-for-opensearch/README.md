# serverless-storytime-for-opensearch

AWS opensearch에 로그 전달을 위한 dummy lambda function 입니다. 현재의 Lambda는 OpenSearch에 의해 subscribe 되므로 여기서는 OpenSearch에서 사용할 로그만을 선별적으로 저장하여야 합니다. 
따라서 아래와 같이, Upload, Rekognition, Polly에 대해 시스템 분석에 필수적인 각 모듈의 동작 시간과 전체 사용 시간을 로그로 남겨서 OpenSearch에서 시스템 모니터링시 활용하도록 합니다. 

```java
    const body = JSON.parse(event.Records[0].body);
    var id = body.Id; 
    
    if(body.From == "upload") {        
        var elapsedTimeForUpload = body.ElapsedTimeForUpload;
        console.log('elapsedTimeForUpload: '+elapsedTimeForUpload+', id= '+id);

        var downURL = body.DownURL;
        var needDupChk = body.NeedDupChk;
        if(!downURL && needDupChk) { // duplicated case
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
```

Lambda 생성시 아래의 SQS 포미션을 포함하여야 합니다.

```java
          {
            "Effect": "Allow",
            "Action": [
              "sqs:SendMessage",
              "sqs:DeleteMessage",
              "sqs:ChangeMessageVisibility",
              "sqs:ReceiveMessage",
              "sqs:TagQueue",
              "sqs:UntagQueue",
              "sqs:PurgeQueue",
              "sqs:GetQueueAttributes"
            ],
            "Resource": "arn:aws:sqs:ap-northeast-2:****:sqs-storytime-for-opensearch"
          }
```          
