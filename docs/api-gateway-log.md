# API Gateway Log 설정


 
1. IAM console에 접속 

https://console.aws.amazon.com/iamv2/home#/roles


2. [Create roles]를 선택

<img width="1048" alt="module8-2" src="https://user-images.githubusercontent.com/52392004/156366042-ca442759-7afc-40e8-b611-86c4b15b9322.png">


3. [Use case]에서 “API Gateway”를 선택하고 “Allows API Gateway to push logs to CloudWatch Logs”를 enable 한후에 [Next]를 선택한다.

<img width="1011" alt="module8-3" src="https://user-images.githubusercontent.com/52392004/156366095-feecf0c7-de1e-45dd-93da-cfd93938cc57.png">

4. [Add permissions]에서 AmazonAPIGatewayPushToCloudWatchLogs를 확인하고 [Next]를 선택한다.

<img width="1026" alt="module8-4" src="https://user-images.githubusercontent.com/52392004/156366146-7b13eafd-ff35-46b3-9514-16916031166a.png">

5. [Role details]에서 [Role name]으로 “api-gateway-logs-seoul”을 입력하고 스크롤하여 [Create role]을 선택한다.  

<img width="766" alt="module8-5" src="https://user-images.githubusercontent.com/52392004/156366196-3ec7ed69-ddb9-4d1d-ad8a-055f7f2511bc.png">

6. [IAM] - [Roles] 에서 “api-gateway-logs-seoul”을 검색하여, 아래의 ARN 을 확인한다.

![module8-6](https://user-images.githubusercontent.com/52392004/156366253-4f2cdead-6d23-404e-afa8-acba1f8ae6b9.png)

## Configure the IAM Role in API Gateway
  
1. API Gateway의 console로 이동한다.

  https://ap-northeast-2.console.aws.amazon.com/apigateway/main/apis?region=ap-northeast-2

2. 왼쪽 메뉴 마지막의 [Settings]를 선택후, 아래와 같이 CloudWatch log role ARN을 입력하고 [Save]를 선택한다.

<img width="868" alt="module8-7" src="https://user-images.githubusercontent.com/52392004/156366316-cd8a0812-aeb6-4074-9dc2-eca9df247583.png">

  
## Configure logging in each API

1. [API: api-filestore] - [Stages] - [dev] - [dev Stage Editor] - [Logs/Tracing]에서 [Enable CloudWatch Logs]를 enable, [log lever]은 INFO로, [Log full requests/responses data], [Enable Detailed CloudWatch Metrics]을 모두 enable 한다.

![module8-8](https://user-images.githubusercontent.com/52392004/156366389-8dd2782e-5e11-43bd-b333-e23f4b527783.png)

  
## Trouble shooting

[Save Changes]를 선택했는데 아래와 같이 “CloudWatch Logs role ARN must be set in account settings to enable logging” 에러가 발생하는 경우는 상기와 같이 Roles의 API Gateway log에 대한 ARN이 [Settings]에 잘 설정되어 있는지 확인한다.  


<img width="558" alt="module8-9" src="https://user-images.githubusercontent.com/52392004/156366420-a167926d-1470-40e7-b29a-38340437ff7f.png">
 
