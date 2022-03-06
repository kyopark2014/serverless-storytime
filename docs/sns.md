# 7. Amazon SNS 구현
 
AWS Lambda 가 이벤트를 처리한 결과를 email 로 전송할 때 사용할 Amazon SNS 를 구성하고자 합니다.

1) AWS 콘솔  에서 Amazon SNS 서비스로 이동합니다. 리전은 서울(ap-northeast-2)을 사용합니다.

https://ap-northeast-2.console.aws.amazon.com/sns/v3/home?region=ap-northeast-2#/homepage

2) SNS console - [Topics]에서 아래와 같이 [Standard]을 선택하고, [Name]은 “sns-storytime”을 입력합니다. 스크롤을 내려서 [Create topic] 을 선택하여 topic을 생성합니다. 


![image](https://user-images.githubusercontent.com/52392004/156882322-8cbc059d-e685-4f52-bab8-9be0447855b4.png)


3) [Amazon SNS] - [Topics] - [sns-storytime] - [Subscription]에서 [Create subscription]을 선택합니다. 


![noname](https://user-images.githubusercontent.com/52392004/156882372-b050bcf4-c7ab-47f2-9a7b-8f34864bc62c.png)


4) [Protocol]은 “Email”을 선택하고, Endpoint로 이메일 주소를 입력 합니다. [Create subscription]을 선택하여 subscription을 마무리 합니다. 


![noname](https://user-images.githubusercontent.com/52392004/156882433-df0e1441-bd4f-4299-b4dc-95094e2434ed.png)



5) 입력한 메일주소로 “AWS Notification Subscription Confirmation”라는 메일이 아래와 같이 도착하면 “Confirm subscription” 링크를 선택하여 Confirm 합니다. 

![noname](https://user-images.githubusercontent.com/52392004/156882490-a82292a0-12f5-4470-9b68-4ffd0ea30f6e.png)


이후 아래와 같이 Confirm 됩니다. 

![noname](https://user-images.githubusercontent.com/52392004/156882523-68dbb332-a0c2-48c8-bf21-b1d6b51aa691.png)

