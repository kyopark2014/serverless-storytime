# API Gateway 구현
 
Amazon API Gateway는 REST full의 Endpoint로 활용할 수 있으며, Lambda를 연결할때 유용합니다.

1) AWS 콘솔 에서 Amazon API Gateway 서비스로 이동합니다.

[[Console]](https://ap-northeast-2.console.aws.amazon.com/apigateway/main/apis?region=ap-northeast-2#) 

https://ap-northeast-2.console.aws.amazon.com/apigateway/main/apis?region=ap-northeast-2#



![apigw-1](https://user-images.githubusercontent.com/52392004/156360445-20c9bb15-8d99-49aa-830d-46bbac6943c0.png)




2) 우측 상단의 [Create API] 를 클릭하고 [REST API] 옵션의 [Build] 버튼을 선택합니다.

![apigw-2](https://user-images.githubusercontent.com/52392004/156360522-3999362e-fb99-4466-8520-5a5d164ab756.png)



3) API 생성 화면에서 Create new API 에는 [New API] 를 선택하고 하단 Settings 의 [API name] 에는 “api-storytime” 를 입력합니다. [Endpoint Type] 은 Regional 을 선택합니다. API 트래픽의 오리진에 따라 Edge, Regional, Private 등의 옵션 을 제공하고 있습니다. [Create API] 를 클릭하여 API 를 생성합니다.

![image](https://user-images.githubusercontent.com/52392004/156878055-419fedb2-23d1-4319-91f2-7de98d4320e6.png)


4) 미디어 파일을 지원하기 위해 [API: api-storytime] - [Settings] 에서 스크롤하여 [Binary Media Types]를 아래와 같이 설정합니다.


![apigw-4](https://user-images.githubusercontent.com/52392004/156360665-c5fc62ed-0b38-4617-88e3-e2ec0cfc2637.png)



5) API 생성이 완료되면 [Resources] 메뉴 상단의 [Actions] 버튼을 드롭 다운 한 뒤 [Create Resources] 옵션을 선택합니다.

![image](https://user-images.githubusercontent.com/52392004/156878114-12c400e7-96d6-4282-ae07-703bbcf4029c.png)


6) [New Child Resource]에서 [Resource Name]을 "upload"로 입력하고 [Create Resource]를 선택합니다.

<img width="972" alt="apigw-6" src="https://user-images.githubusercontent.com/52392004/156360750-dc5053e7-5f54-445a-88fa-c65c11630504.png">



7) API 생성이 완료되면 [Resources] 메뉴 상단의 [Actions] 버튼을 드롭 다운 한 뒤 [Create Method] 옵션을 선택합니다.

![image](https://user-images.githubusercontent.com/52392004/156878137-5ea9cf00-ba82-43fa-89db-b81bdc240304.png)



생성된 빈 드롭 다운 메뉴에서는 [POST] 을 선택한 뒤 체크 버튼을 클릭합니다.

![image](https://user-images.githubusercontent.com/52392004/156878165-0697d41b-9e57-436b-b608-9d68b27dd3ec.png)


8) / - POST - Setup 화면이 나타납니다. [Ingegration type] 은 Lambda Function 을 선택하고 [Lambda Region] 은 ap-northeast-2 를 선택합니다. [Lambda Function] 에는 미리 만든 "lambda-storytime-upload"를 선택합니다. [Save] 를 선택하여 API 메소드 생성을 완료합니다.g)

![image](https://user-images.githubusercontent.com/52392004/156878191-027e7385-73f5-461f-87e1-c2b17068cefc.png)


9) 아래와 같이 Add Permission to Lambda Function 팝업이 나타나면 [OK] 를 선택합니다.

![noname](https://user-images.githubusercontent.com/52392004/156878357-a47114a8-2a89-4dd9-b77c-7dd368e6c289.png)


이후 아래와 같이 생성된 API 를 확인 할 수 있습니다.

![noname](https://user-images.githubusercontent.com/52392004/156878442-73cad110-509c-4a24-8e98-6ced2e6da103.png)



10) Binary contents 처리를 위해 [API-storytime] - [Resources] - [upload - POST]에서 [Integration Request]를 선택합니다. 이후 아래로 스크롤하여 [Mapping Templates]을 설정합니다.

1. “Request body passthrough”에서 “When there are no templates defined (recommended)”를 선택

2. [Content-Type]의 [Add mapping template]를 선택하여 “image/jpeg”을 추가

![apigw-12](https://user-images.githubusercontent.com/52392004/156361006-d8eb4c0d-b6f8-49dd-9b39-11af78d84a06.png)


3. “image/jpeg”을 선택후 “Generate template”에서 “Method Request passthrough”를 선택후 저장

![apigw-13](https://user-images.githubusercontent.com/52392004/156361033-1394509d-433b-4830-b584-c0cd65aaa5bc.png)


같은 방식으로 "image/jpg", "application/octet-stream", "image/png" 등등 원하는 포맷을 추가 합니다. 

[관련 참고]

https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types


11) 생성한 API 를 배포해줘야 합니다. [Resources] 메뉴 상단의 [Actions] 버튼을 드롭다운 한 뒤 [Deploy API] 를 클릭합니다.

![image](https://user-images.githubusercontent.com/52392004/156878541-82aa1855-a4e5-423f-b625-991585e9ee70.png)



12) [Deploy stage] 는 [New Stage] 를 선택하고 [Stage name*] 에는 dev 를 입력한 뒤 [Deploy] 버튼을 클릭합니다.

13) 아래와 같이 [Stages] - [dev]를 선택한후, invoke URL을 확인합니다.

```c
https://8bxfftack4.execute-api.ap-northeast-2.amazonaws.com/dev

````

![image](https://user-images.githubusercontent.com/52392004/156878589-f4e73ae3-8f44-44e5-879f-887a0aca08c8.png)


14) 아래와 같이 [Logs/Tracing]의 [CloudWatch Settings]에서 [Enable CloudWatch Logs], [Log full requests/responses date], [Enable Detailed CloudWatch Metrics]를 모두 enable 하고 [Log level]을 “INFO”로 설정합니다.

![image](https://user-images.githubusercontent.com/52392004/156878623-6f360f10-5dea-4fb9-b2d5-17bf7560329f.png)

15) 결과를 조회하는 API를 구현하기 위하여, [APIs] - [api-storytime] - [Resources] - [Actions]에서 [Create Resources]를 선택하고, 아래와 같이 "retrieve"로 합니다. 

![image](https://user-images.githubusercontent.com/52392004/157036884-e1859a78-4d25-4960-8e2c-644574de364c.png)


16) [Actions] - [Create Method]를 선택한후, 아래와 같이 HTTP GET을 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/156932713-4358b9cd-79ee-4683-996e-1f4e6de0e7ce.png)


17) [Lambda Function]으로 아래와 같이 lambda-storytime-for-retrieve를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157037197-979fe34f-a7e0-4f8d-881a-88c4520396fd.png)


18) 아래와 같이 "OK"를 선택합니다.

![noname](https://user-images.githubusercontent.com/52392004/157037383-73c49d53-a56f-48a8-9cfc-308b3a95fc77.png)




19) 추가한 Retrieve API는 아래와 같습니다. 

![noname](https://user-images.githubusercontent.com/52392004/157037563-7911fbcf-c621-496a-ae2b-6f0d59abaed3.png)


20) Header 처리를 위한 Content-type 추가 


Lambda 함수는 API Gateway API 요청에서 수신하는 메서드 요청 본문만 처리합니다. 따라서, API Gateway API에서 Lambda 함수로 사용자 지정 헤더를 전달하려면 본문 매핑 템플릿을 사용하여야 합니다. (https://aws.amazon.com/ko/premiumsupport/knowledge-center/custom-headers-api-gateway-lambda/)
따라서, 아래와 같이 application/json을 content-type으로 추가 합니다.

[API:api-storytime] - [Resouces] - [/retrieve] - [GET] - [Integration Request]로 진입합니다. 

![image](https://user-images.githubusercontent.com/52392004/157037998-f600fa6a-6a14-43c7-98c3-2417e179856b.png)


21) [Mapping Templates]에서 아래와 같이 application/json을 추가하고, [Generate template]에서 [Method request passthrough] 을 추가합니다. 


[주의] HTTP GET으로 API Gateway - Lambda 호출시 상기 정의한 "Content-Type: Application/json"을 추가하여야 합니다. 

예) curl -i https://8bxfftack4.execute-api.ap-northeast-2.amazonaws.com/dev/getResult -X GET -H 'ETag: 005e260b-7b3e-4904-b500-9853fc40a273' -H 'Timestamp: 1646580038' -H 'Content-Type: application/json'
 
