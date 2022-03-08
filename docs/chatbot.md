# AWS chatbot으로 인프라 컨트롤


1) IAM Role에서 [Create role] 선택 

https://console.aws.amazon.com/iamv2/home#/roles

<img width="1348" alt="image" src="https://user-images.githubusercontent.com/52392004/157139872-f095851f-dabb-4272-a3b5-2b61c6623250.png">

[Select trusted entity]에서 [AWS Chatbot] 선택

![image](https://user-images.githubusercontent.com/52392004/157140023-c4a2eadf-207d-4721-a190-93c16b9b5d00.png)

다시 [AWS Chatbot] 선택후 Next

![image](https://user-images.githubusercontent.com/52392004/157140095-d938e4e6-484b-4706-822a-a36c5f284f40.png)

원하는 퍼미션 선택 후 이름 반영합니다.

예) EC2 Full Access

2) Polcies에서 chatbot for guardrail 설정 

(추후 추가)


3) Chatbot Console에 접속 합니다. 

https://us-east-2.console.aws.amazon.com/chatbot/home?region=ap-northeast-2#/chat-clients

4) [Configure new client]에서 [Slack]을 선택합니다.

![image](https://user-images.githubusercontent.com/52392004/157150820-22f8a688-8604-4a61-9546-a9761dc53bc4.png)

5) Allow를 선택합니다.

![image](https://user-images.githubusercontent.com/52392004/157147793-7dcf80b2-beb6-4a50-9d15-7c083831dde9.png)

6) chatbot console로 다시 접속

https://us-east-2.console.aws.amazon.com/chatbot/home#/chat-clients

[AWS Chatbot] - [Configured clients] - [Slack workspace: AWS] - [Configure Slack channel]으로 진입하여, [configuration name]을 "slack-storytime"으로 설정하고, Logging을 활성화 합니다. 

![image](https://user-images.githubusercontent.com/52392004/157141055-41ede08c-dfff-46de-8484-b81276c5d2d6.png)

7) 알람을 받기 위한 SNS 설정하기 위하여 Console로 접속합니다. 

https://ap-northeast-2.console.aws.amazon.com/sns/v3/home?region=ap-northeast-2#/topics

[Create topic]을 선택하여 Topic name으로 아래와 같이 "sns-chatbot"을 입력하여 생성합니다. 

![image](https://user-images.githubusercontent.com/52392004/157143541-5cf23252-4478-489d-ac4f-de17aea1bc85.png)


8) slack을 실행시키고 [channels]에서 [Create a channel]을 선택하고 "storytime"을 생성 합니다. 

![image](https://user-images.githubusercontent.com/52392004/157141767-dd36a612-f1cf-4a67-a0a4-3edb1e40b543.png)

"storytime" channel을 선택하고 [Open channel details]를 선택후 아래로 스크롤하여 ChannelID를 확인합니다. 여기서는 C036QV05S2C 입니다. 

![noname](https://user-images.githubusercontent.com/52392004/157142203-ec0b85e9-cbdb-4193-b345-37e6daaa65ba.png)


9) Channel ID를 아래와 같이 입력 합니다. 

![image](https://user-images.githubusercontent.com/52392004/157142349-694c241d-c926-4b44-a746-f6838a0f43c1.png)

10) 생성한 Role과 Policy를 아래와 같이 적용합니다. 

![image](https://user-images.githubusercontent.com/52392004/157143178-caf5f14f-8ce0-4968-bc39-4edab6b7dca7.png)

11) SNS Topics에서 기생성한 "sns-chatbot"을 선택하고 [Configure]를 선택합니다.

![image](https://user-images.githubusercontent.com/52392004/157143752-b4d05700-1ff2-4615-a03c-bcb451f10ee3.png)


12) slack 화면의 #storytime으로 이동하여 aws chatbot을 아래 명령으로 등록합니다. 

```c
/invite @aws
```

만약, aws로 입력시 chatbot 이름이 보여지지 않으면 chatbot configure가 잘 설정되었는지 확인 합니다. 

13) 아래와 같이 생성된 정보를 확인 합니다. 

![noname](https://user-images.githubusercontent.com/52392004/157150599-b855602c-32cb-486d-bb2e-704bd885d037.png)


14) 다시 chatbot으로 아래와 같이 이동하여 "slack-storytime"을 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157152041-7e9de8b5-dd00-49a2-a2e5-13ad1dfa1aae.png)


15) [Send test messages]를 선택하여 동작을 확인 합니다. 

![noname](https://user-images.githubusercontent.com/52392004/157152196-5148a650-22a6-427d-8ea7-b6232f29e82c.png)

정상적으로 동작하면 아래처럼 챗봇 메시지를 확인할 수 있습니다. 

![noname](https://user-images.githubusercontent.com/52392004/157152349-af235cb4-0c3c-40af-9ed9-2d1773fb7fc9.png)


16) 참고로 SNS는 아래처럼 자동으로 설정이 됩니다. 

![image](https://user-images.githubusercontent.com/52392004/157148859-7716aeee-00b7-4959-a141-5bf178cd7b21.png)


17) 명령어 수행 


<img width="360" alt="image" src="https://user-images.githubusercontent.com/52392004/157152624-e039f0f0-21b3-423e-8afc-dcb48ff7824a.png">








## Reference

[HowTo]Slack에서 채팅만으로 EC2를 중지시킬 수 있다고? (5분만에 Slack에서 AWS CLI 사용하는 방법)

https://www.youtube.com/watch?v=-Jku6JQtrqQ
