# serverless-storytime-for-polly

본 저장소(Repository)를 통해 Simple Serverless Voice Book Creator ( https://github.com/kyopark2014/serverless-storytime )의 AWS Polly 관련된 코드를 관리하고자 합니다.

전체적인 Serverless Architecture는 아래와 같습니다. 

<img width="1195" alt="image" src="https://user-images.githubusercontent.com/52392004/154789870-4c21323d-6c01-4999-aac1-0119fdb71c02.png">

Rekognition가 추출한 텍스트는 json형태로 전달되는데, 여기서 text를 추출하여 AWS Polly에서 Voice로 변환합니다. 생성된 mp3 음성파일은 S3에 저장되고 CloudFront를 통해 외부에 공유 될 수 있습니다. 완성된 URL 정보는 AWS SNS를 통하여 사용자에게 이메일로 전달됩니다. 

## Text Extraction (Post Processing)
현 단계에서 JSON 파일에서 단순히 텍스트를 추출하여 문장을 만듧니다. 추후는 Post Processing을 통해 사용자가 좀 더 편안히 읽을수 있도록 할 수 있습니다. 

```java
    const body = event['Records'][0]['body'];
    console.log('body = '+body);

    const obj = JSON.parse(body);
    const bucket = obj.Bucket;
    const originalKey = obj.Name;
    const uuid = obj.Id;
    
    const data = JSON.parse(obj.Data);
    var text = "";
    for (var i = 0; i < data.TextDetections.length; i++) {
        text += data.TextDetections[i].DetectedText;
    }
    console.log('text: '+text);
````

## Voice 파일로 변환 (AWS Polly)

아래와 같이 Polly를 통해 Voice 파일의 형태인 mp3로 저장합니다. 

```java
    ㅣet pollyResult, key;
    try {
        pollyResult = await polly.startSpeechSynthesisTask(polyParams).promise();
        console.log('pollyResult:', pollyResult);

        const pollyUrl = pollyResult.SynthesisTask.OutputUri;
        console.log('url: '+pollyUrl);
        const fileInfo = path.parse(pollyUrl);
        
        key = fileInfo.name + fileInfo.ext;
        console.log('key: ', key);

        console.log('### finish polly: ' + uuid);
    } catch (err) {
        console.log(err);
    } 
```

## User Notification (AWS SNS)
AWS SNS를 통해 사용자에게 생성된 음성파일의 URL을 전달합니다. 

```java
    console.log('### start sns: ' + uuid);
    var url = CDN+key
    var snsParams = {
        Subject: 'Get your voice book generated from '+key,
        Message: '('+uuid+') Link: '+url,         
        TopicArn: 'arn:aws:sns:ap-northeast-2:****:sns-simple-storytime'
    }; 
    
    let snsResult;
    try {
        snsResult = await sns.publish(snsParams).promise();
        console.log('snsResult:', snsResult);

        console.log('### finish sns: ' + uuid);
    } catch (err) {
        console.log(err);
    }
```    
