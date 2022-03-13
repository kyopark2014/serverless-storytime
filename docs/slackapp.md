# Slack으로 메시지 전송

## Slack Webhook

Slack의 대화방에 메시지를 전송하기 위해서는 Slack Token이 필요합니다. 

1) Slack api에 접속합니다.

https://api.slack.com/apps?new_app=1

아래에서 [From scratch]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157184256-3fd1c0dc-c8a5-48bb-a4c4-9e7603e4a8f4.png)


2) [Name app & choose workspace]에서 App Name으로 "storytimeBot"으로 입력하고, [Pick a workspace to develop your app in:] 에서 현재 사용하고 있는 Slack의 Workspace를 지정합니다. 여기서는 본 데모를 위해 "Storytime"이라는 workspace를 위해 생성 하였습니다. 

![image](https://user-images.githubusercontent.com/52392004/157285816-58c80e97-80df-4696-8768-b8ad2d8a0b37.png)


3) 왼쪽 메뉴에서 OAuth&Permission을 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157286724-79aaa7f6-d82c-45e3-bd95-4ef80d108aac.png)



4) 아래로 스크롤하여 [Scopes] - [Bot Token Scopes]에서 [Add on OAuth Scope]를 선택합니다. 


![image](https://user-images.githubusercontent.com/52392004/157287089-ac2d7110-17c8-4435-9bd1-072c320e340d.png)

아래로 이동해 "Chat:write"을 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157287258-065ba58b-bad6-4d91-b313-f846030de49d.png)

5) [OAuth Tokens for Your Workspace] 에서 [Install to Workspace]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157287472-097940ce-6cf7-4ba3-8f93-ffca0db11a85.png)


6) [Allow] 를 선택합니다.

![image](https://user-images.githubusercontent.com/52392004/157287660-0e27acea-4343-4efd-8b7a-200faba26fd5.png)


7) 아래처럼 화면이 전환되면 [Bot User OAuth Token]을 복사 합니다. 

![noname](https://user-images.githubusercontent.com/52392004/157288132-d4bec3fb-c13e-4aed-b6ed-d773d190b659.png)


8) 복사한 Token은 [Lambda] - [Functions] - [labda-storytime-for-slack]의 [Configuration] - [Environment variables]로 이등해서 등록하여 사용하여야 합니다.

![image](https://user-images.githubusercontent.com/52392004/157288467-cb25bb5b-de44-486a-939e-cd0b84c100ab.png)

아래와 같이 "token"이라는 key로 등록합니다. 
![noname](https://user-images.githubusercontent.com/52392004/157288667-ce95b61f-2694-4a03-8bce-e4d94e24228d.png)

소스에 토큰을 하드코딩하여 Github에 공유하면, Slack이 이를 확인하여 자동으로 해당 토큰을 정지합니다. 테스트 용도라도 토큰과 같은 중요한 정보는 Environment variable로 관리하는것이 좋습니다. 


9) Slack의 "storytime" channel에서 아래와 같이 "/invite @storybot" 이라고 입력해서 chatbot을 등록 합니다. 

<img width="638" alt="image" src="https://user-images.githubusercontent.com/52392004/157290277-00aabff5-b122-4aa9-80b7-a7a3d87ebd23.png">


10) storytime서버에 이미지를 전송하면 slat으로 아래처럼 전달되는지 확인 합니다. 


![noname](https://user-images.githubusercontent.com/52392004/157291591-2d46f158-84a6-47f7-9798-384bee210c37.png)


## Troubleshooting 

Node.js로 코드 구현하여 Lambda에 포팅하여 테스트시, Incoming Webhook과 Slack apps 방식 모두에서 정상적으로 메시지를 수신하지 못하는 현상이 발생하였습니다. 로그 분석을 통해 원인이 API 호출후 응답을 받기 전에 Lambda가 종료됨으로 인하여 API 호출이 완료되지 않아서 Slack에서 중지한것으로 보여집니다. 관련하여 Lambda 사용시 javascript event loop에 대한 [posting](https://stackoverflow.com/questions/31633912/how-to-wait-for-async-actions-inside-aws-lambda)을 참조하여, 아래처럼 Lambda를 강제로 종료시키지 않는 방법으로 해결하였습니다. 

```java
function wait(){
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve("hello"), 2000)
    });
  }
  console.log(await wait());
  console.log(await wait());
  console.log(await wait());
  console.log(await wait());
  console.log(await wait());
  console.log(await wait());
  
  return 'exiting'
```

