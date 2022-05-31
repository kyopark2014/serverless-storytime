# 파일 업로드를 위한 Lambda

사용자가 업로드한 컨텐츠는 RESTful API를 통해 API Gateway를 통해 전송되는데 이때 보안을 위해 https를 이용해 전달됩니다. 이후, Lambda를 통해 event에서 파일을 추출해서 S3에 저장하게 됩니다. 이후, Rekognition이 처리하기전에 Queuing을 하기 위해 JSON 형태의 event를 SQS에 전송합니다.


#### Lambda로 전달된 event에서 아래와 같이 body를 추출 합니다. 

```java
exports.handler = async (event, context) => {
    console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env));
    // console.log('## EVENT: ' + JSON.stringify(event))
    
    const body = Buffer.from(event["body-json"], "base64");
    console.log('## EVENT: ' + JSON.stringify(event.params));
    console.log('## EVENT: ' + JSON.stringify(event.context));
```

컨텐츠의 Body 추출시 "body-json"을 기준으로 한것은, API Gateway에서 Mapping Templates를 아래와 같이 설정하였기 때문입니다.

```c
##  See http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
##  This template will pass through all parameters including path, querystring, header, stage variables, and context through to the integration endpoint via the body/payload
#set($allParams = $input.params())
{
"body-json" : $input.json('$'),
"params" : {
#foreach($type in $allParams.keySet())
    #set($params = $allParams.get($type))
"$type" : {
    #foreach($paramName in $params.keySet())
    "$paramName" : "$util.escapeJavaScript($params.get($paramName))"
        #if($foreach.hasNext),#end
    #end
}
```

### 파일이름의 추출

curl, Postman 또는 Web을 통해 파일 업로드시 파일을 "Content-Disposition" 헤더에 포함하여 전달하여야 합니다. 현재의 파일공유 서비스는 간단한 형태로 제공하기 위하여, S3에 파일 저장시에 사용자가 입력한 파일명으로 저장합니다. 만약 동일한 파일명으로 전송하는 경우에 덮어 써집니다. 이를 고려하기 위해서는 파일 저장시 고유한 이름인 UUID로 저장후, 원본 파일의 이름을 UUID와 조합하여 데이터베이스에 저장하여야 합니다. 
content-disposition을 통해 아래와 같이 파일이름을 추출하고 있으며, 헤더가 소문자/대문자 모두 처리 할 수 있습니다. 

```java
    const cd = require('content-disposition');
    var contentDisposition;
    if(event.params.header['Content-Disposition']) {
        contentDisposition = event.params.header["Content-Disposition"];  
    } 
    else if(event.params.header['content-disposition']) {
        contentDisposition = event.params.header["content-disposition"];  
    }
    
    var filename = "";
    if(contentDisposition) {
        filename = cd.parse(contentDisposition).parameters.filename;
    }
    console.log('filename = '+filename);
    
    console.log('disposition = '+contentDisposition);
````

### 버켓에 저장

사용자가 전송한 컨텐츠는 아래와 같이 "s3-simple-storytime" 버켓에 저장되며, 이때 key로 파일명을 사용합니다. 

```java
    const bucket = 's3-simple-storytime';
    try {
        const destparams = {
            Bucket: bucket, 
            Key: filename,
            Body: body,
            ContentType: contentType
        };
        const {putResult} = await s3.putObject(destparams).promise(); 

    } catch (error) {
        console.log(error);
        return;
    } 
```
