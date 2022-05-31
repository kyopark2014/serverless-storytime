# serverless-storytime-for-bulk-interface

입력된 결과의 파싱 로직은 아래와 같습니다. 

```java
    var body = Buffer.from(event['body-json'], 'base64');
    console.log('body: '+body);

    const eventInfo = JSON.parse(body);
```

DynamoDB로 부터는 결과조회는 아래와 같이 수행합니다. 

```java
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

        origURL = dynamoGet.Item.Info.OrigURL;
        downURL = dynamoGet.Item.Info.DownURL;

        if(downURL) {
            message += 'Original Image: '+origURL+'\nMP3 Link: '+downURL+'\n\n';
        }  
```        

결과는 아래와 같이 AWS SNS로 전달합니다.

```java
        // publish to SNS
        console.log('start sns: ' + id);   
        var snsParams = {
            Subject: 'Get your voice stories',
            Message: message,        
            TopicArn: 'arn:aws:sns:ap-northeast-2:****:sns-storytime'
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
```        
