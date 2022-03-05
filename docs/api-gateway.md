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

![apigw-10](https://user-images.githubusercontent.com/52392004/156360931-dca24093-e227-47ef-8865-be159d9cb6ee.png)


이후 아래와 같이 생성된 API 를 확인 할 수 있습니다.

![apigw-11](https://user-images.githubusercontent.com/52392004/156360970-a48185aa-6f55-4622-9188-b78d860d8f10.png)



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


![apigw-14](https://user-images.githubusercontent.com/52392004/156361071-e7771509-3fe0-4348-974a-a742676ebf4e.png)


12) [Deploy stage] 는 [New Stage] 를 선택하고 [Stage name*] 에는 dev 를 입력한 뒤 [Deploy] 버튼을 클릭합니다.

13) 아래와 같이 [Stages] - [dev]를 선택한후, invoke URL을 확인합니다.

```c
https://ds1y3ss8wg.execute-api.ap-northeast-2.amazonaws.com/dev

````

![apigw-15](https://user-images.githubusercontent.com/52392004/156361107-49724049-c050-4618-9631-705e41c1e8e1.png)



14) 아래와 같이 [Logs/Tracing]의 [CloudWatch Settings]에서 [Enable CloudWatch Logs], [Log full requests/responses date], [Enable Detailed CloudWatch Metrics]를 모두 enable 하고 [Log level]을 “INFO”로 설정합니다.

![apigw-16](https://user-images.githubusercontent.com/52392004/156361136-39d893f8-f091-45e9-8e50-7ea97107b416.png)




