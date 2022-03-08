1)
2) Configure new client

![image](https://user-images.githubusercontent.com/52392004/157147713-09200423-e7db-4ec7-9920-499614d5f86f.png)

3) Allow를 선택합니다.

![image](https://user-images.githubusercontent.com/52392004/157147793-7dcf80b2-beb6-4a50-9d15-7c083831dde9.png)


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

10) 알람을 받기 위한 SNS 설정

콘솔로 접속합니다. 

https://ap-northeast-2.console.aws.amazon.com/sns/v3/home?region=ap-northeast-2#/topics

[Create topic]을 선택하여 Topic name으로 아래와 같이 "sns-chatbot"을 입력하여 생성합니다. 

![image](https://user-images.githubusercontent.com/52392004/157143541-5cf23252-4478-489d-ac4f-de17aea1bc85.png)


10) slack을 실행시키고 [channels]에서 [Create a channel]을 선택하고 "storytime"을 생성 합니다. 

![image](https://user-images.githubusercontent.com/52392004/157141767-dd36a612-f1cf-4a67-a0a4-3edb1e40b543.png)

"storytime" channel을 선택하고 [Open channel details]를 선택후 아래로 스크롤하여 ChannelID를 확인합니다. 여기서는 C036QV05S2C 입니다. 

![noname](https://user-images.githubusercontent.com/52392004/157142203-ec0b85e9-cbdb-4193-b345-37e6daaa65ba.png)

Channel ID를 아래와 같이 입력 합니다. 

![image](https://user-images.githubusercontent.com/52392004/157142349-694c241d-c926-4b44-a746-f6838a0f43c1.png)

생성한 Role과 Policy를 아래와 같이 적용합니다. 

![image](https://user-images.githubusercontent.com/52392004/157143178-caf5f14f-8ce0-4968-bc39-4edab6b7dca7.png)


11) SNS Topics에서 기생성한 "sns-chatbot"을 선택하고 [Configure]를 선택합니다.ㅏ

![image](https://user-images.githubusercontent.com/52392004/157143752-b4d05700-1ff2-4615-a03c-bcb451f10ee3.png)


12) 아래와 같이 생성된 정보를 확인 합니다. 

![image](https://user-images.githubusercontent.com/52392004/157148118-81581478-94b8-4a8e-b447-a94176ef851c.png)
