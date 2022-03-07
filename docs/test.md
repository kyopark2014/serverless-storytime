# 9. 테스트 및 결과

 
## 시험방법1 (Upload)

1) Postman에서 시험하는 경우에 아래와 같이 Content-Type과 Content-Disposition을 설정후, Binary를 첨부하여 테스트 합니다. 

![test-1](https://user-images.githubusercontent.com/52392004/156370571-ebe65d13-c223-4b94-9713-459974bfb099.png)


2) Curl로 시험하는 경우 

```c
$ curl -i https://spzxqv5ftg.execute-api.ap-northeast-2.amazonaws.com/dev/upload -X POST --data-binary '@sample.jpeg' -H 'Content-Type: image/jpeg' -H 'Content-Disposition: form-data; name="sample"; filename="sample.jpeg"'

HTTP/2 200
date: Sun, 20 Feb 2022 12:23:41 GMT
content-type: application/json
content-length: 127
x-amzn-requestid: 554a5b3b-859b-41eb-90b2-fdf83ef13339
x-amz-apigw-id: N1zfrFXuIE0FvJw=
x-amzn-trace-id: Root=1-621232c8-37a90762301f99e01dc8c15e;Sampled=0

{"statusCode":200,"body":"{\"Bucket\":\"s3-simple-voicebookcreator\",\"Key\":\"sample3.jpeg\",\"ContentType\":\"image/jpeg\"}"}
```

3) 안드로이드 앱에서 하는 방법

아래의 "API Tester: Debug requests"을 다운받습니다.

<img width="327" alt="test-2" src="https://user-images.githubusercontent.com/52392004/156370605-5febce82-e3c7-470b-9a72-5ae62bd20cab.png">



아래와 같이 서버주소를 입력하고, Params에서 Binary를 선택한다음 원하는 사진을 선택합니다. 여기서 Headers의 Content-Type은 application/octet-stream을 그래도 유지하여도 정상적으로 동작합니다.

<img width="331" alt="test-3" src="https://user-images.githubusercontent.com/52392004/156370689-760f91b8-1c8f-4b3b-9a05-9dd5ea7013ce.png">


상단의 화살표 모양의 아이콘을 선택하여 발송하고 메일로 정상적으로 mp3로 된 음성파일이 들어오는지 확인합니다.

### 결과 

아래와 같이 지정된 메일로 링크를 포함한 결과가 전달됩니다. 링크 선택시 CloudFront를 통해 다운로드된 컨텐츠가 정상적으로 재생되는것을 확인합니다.


<img width="1017" alt="test-4" src="https://user-images.githubusercontent.com/52392004/156370722-43cf999e-170b-499c-a02d-07dc4cbdb95f.png">


Sample : https://github.com/kyopark2014/simple-serverless-voicebookcreator/blob/main/sample.jpeg

<img width="1267" alt="test-5" src="https://user-images.githubusercontent.com/52392004/156370778-5b92de07-e87d-4c9f-8db1-86bc5d47f850.png">

Result : https://github.com/kyopark2014/simple-serverless-voicebookcreator/blob/main/sample-result.mp3
      
## 시험방법2 (Retrieve)

### Curl을 이용한 시험방법 

Retrieve는 Upload API 이후에 수행되므로 ETag을 통해 event의 ID와 시간(timestamp)를 알수 있습니다. 이 두 값은 DynamoDB에 해당 event를 저장시 Partition key와 Sort key로 사용되므로, Retrive 조회시 반드시 Header로 포함되어야 합니다. 따라서 아래와 같이 curl로 조회시 ETag와 Timestamp를 추가 합니다. 또한, API Gateway - Lambda 사용시 Header값을 전달하기 위하여 "Content-Type:  application/json"을 포함합니다. 

```c
# curl -i https://8bxfftack4.execute-api.ap-northeast-2.amazonaws.com/dev/getResult -X GET -H 'ETag: 005e260b-7b3e-4904-b500-9853fc40a273' -H 'Timestamp: 1646580038' -H 'Content-Type: application/json'
```
