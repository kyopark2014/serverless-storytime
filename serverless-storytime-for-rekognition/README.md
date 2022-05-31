# serverless-storytime-for-rekognition

Rekognition에 전달될 event가 SQS를 통해 Lambda에 전달되면, Rekognition에 이미지에서 텍스트를 추출하도록 요청하게 됩니다. 
추출된 JSON 형태의 데이터는 다시 SQS에 전송되어 Poly를 통해 음성 파일로 변환 됩니다. 

### Rekognition에 이미지 분석을 요청할때 필요한 정보의 추출

Rekognition에 이미지 분석을 위해서는 미리 S3에 이미지가 업로드 되어 있어야 합니다. 업로드된 Bucket 정보의 파일의 이름은 SQS를 통해 Lambda로 전달되게 됩니다. 따라서 아래와 같이 event에서 bucket과 Name을 추출하여 사용 합니다. 
```c
    var messageAttributes = event['Records'][0]['messageAttributes'];
    // console.log('messageAttributes = '+JSON.stringify(messageAttributes));
    
    var bucket = messageAttributes['Bucket'].stringValue;
    console.log('bucket = '+bucket);
    
    var photo = messageAttributes['Name'].stringValue;
    console.log('photo = '+photo);
```

SQS에서 전달되는 event의 예시는 아래와 같습니다. 

```c
2022-02-19T17:03:48.373Z	c9ce7eba-602c-5be2-9f85-2431450714f2	INFO	## EVENT: {
    "Records": [
        {
            "messageId": "087430e7-ded4-44ee-bf3b-b5b2020930a9",
            "receiptHandle": "AQEBFB/w4PEVHl2F1HoKxCJvuEiYrm+S/0/OJAxXcyXtBQUWsRM/ZOlMlzHMtuaFJW90+PS8uTSvQBqqxyLMg6wGF0J4H8TCFMh2zRys09U0jtcBqavycAi/2ACWUKbeUmtxSeTpyiGuG8ND0FSfmVnGZYHbfI8CRu3ZGt/TYbGpGhGg+bihRg08eZafYNvn69x8x7JXRbi0EZgADWgkCGOiyYJBERszRJOPT/PCb9gmBnT1MeWx2l7hB1fSXArwsWaFeWxxcULYMTPs63BN77EHABA+nGDZXedxRiF5a2RpNKpKeGH5p6QiDTVAI0W3IK5EEnkFnmAeyHPOZoX0GNm4+PKM2qm314xg13eVMEud13UI2Uf39m2LLWj2wrNFwK8yDwZFPD3suvnNhkfE2nwb4cpKYCzbUKSEao9wxZemeS2st9O7AHoDpnXykCcPSaBX",
            "body": "UUID",
            "attributes": {
                "ApproximateReceiveCount": "1",
                "SentTimestamp": "1645290214757",
                "SenderId": "AROAZ3KIXN5TFMFD6AEYI:lambda-simple-voicebookcreator-upload",
                "ApproximateFirstReceiveTimestamp": "1645290224757"
            },
            "messageAttributes": {
                "Bucket": {
                    "stringValue": "s3-simple-voicebookcreator",
                    "stringListValues": [],
                    "binaryListValues": [],
                    "dataType": "String"
                },
                "Name": {
                    "stringValue": "sample2.jpeg",
                    "stringListValues": [],
                    "binaryListValues": [],
                    "dataType": "String"
                }
            },
            "md5OfMessageAttributes": "3dd51a16c4e172dcf33861a1c8245e84",
            "md5OfBody": "5a54d9ad87f7c4c1c70c8f05b9515d5a",
            "eventSource": "aws:sqs",
            "eventSourceARN": "arn:aws:sqs:ap-northeast-2:677146750822:sqs-simple-storytime-for-rekognition",
            "awsRegion": "ap-northeast-2"
        }
    ]
}
```

### Rekognition에 Text Extraction 요청

아래와 같이 aws sdk를 사용하여 Rekognition에서 text를 추출합니다. 추출된 text 아래와 같이 JSON 파일에서 추출하여 사용할 수 있습니다.
사진의 text가 산발적으로 있는 경우에는 Post processing을 통해 관련된 문장만 따로 추출하여야 합니다. 

```c
    const aws = require('aws-sdk');
    const rekognition = new aws.Rekognition();
    const params = {
        Image: {
            S3Object: {
                Bucket: bucket,
                Name: photo
            },
        },
    }
    console.log('param = '+JSON.stringify(params))

    try {
        let data = await rekognition.detectText(params).promise();
        console.log('data: '+JSON.stringify(data));

        // text without post processing
        var text = "";
        for (var i = 0; i < data.TextDetections.length; i++) {
            text += data.TextDetections[i].DetectedText;
        }
    } catch (err) {
        console.log(err);
        return error;
    } 
```    
