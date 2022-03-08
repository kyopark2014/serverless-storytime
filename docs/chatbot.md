

5) IAM Role에서 [Create role] 선택 
https://console.aws.amazon.com/iamv2/home#/roles
<img width="1348" alt="image" src="https://user-images.githubusercontent.com/52392004/157139872-f095851f-dabb-4272-a3b5-2b61c6623250.png">

6) [Select trusted entity]에서 [AWS Chatbot] 선택
![image](https://user-images.githubusercontent.com/52392004/157140023-c4a2eadf-207d-4721-a190-93c16b9b5d00.png)

다시 [AWS Chatbot] 선택후 Next
![image](https://user-images.githubusercontent.com/52392004/157140095-d938e4e6-484b-4706-822a-a36c5f284f40.png)

7) 원하는 퍼미션 선택 후 이름 반영
예) EC2 Full Access

8) Polly 설정 


9) chatbot console로 다시 접속

https://us-east-2.console.aws.amazon.com/chatbot/home#/chat-clients

[AWS Chatbot] - [Configured clients] - [Slack workspace: AWS] - [Configure Slack channel]으로 진입하여, [configuration name]을 "slack-storytime"으로 설정하고, Logging을 활성화 합니다. 

![image](https://user-images.githubusercontent.com/52392004/157141055-41ede08c-dfff-46de-8484-b81276c5d2d6.png)

10)
slack을 실행시키고 [channels]에서 [Create a channel]을 선택하고 "storytime"을 생성 합니다. 

![image](https://user-images.githubusercontent.com/52392004/157141767-dd36a612-f1cf-4a67-a0a4-3edb1e40b543.png)

"storytime" channel을 선택하고 [Open channel details]를 선택후 아래로 스크롤하여 ChannelID를 확인합니다. 여기서는 C036QV05S2C 입니다. 

![noname](https://user-images.githubusercontent.com/52392004/157142203-ec0b85e9-cbdb-4193-b345-37e6daaa65ba.png)




