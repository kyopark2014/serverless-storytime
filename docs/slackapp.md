# Slack으로 메시지 전송

## Slack API

Slack의 대화방에 메시지를 전송하기 위해서는 Slack Token이 필요합니다. 

1) Slack api에 접속합니다.

https://api.slack.com/apps?new_app=1

아래에서 [From scratch]를 선택합니다. 


![noname](https://user-images.githubusercontent.com/52392004/172061088-556796d8-14fc-4523-890d-7527ee954853.png)




2) [Name app & choose workspace]에서 App Name으로 "storybot"으로 입력하고, [Pick a workspace to develop your app in:] 에서 현재 사용하고 있는 Slack의 Workspace를 지정합니다. 여기서는 본 데모를 위해 "Storytime"이라는 workspace를 위해 생성 하였습니다. 

![noname](https://user-images.githubusercontent.com/52392004/172077887-b6271e2d-6dd8-4d79-a8a3-fa2aa0b84840.png)





3) 왼쪽 메뉴에서 OAuth&Permission을 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/172077932-8ba0288b-3450-432f-8f49-08e74db78b89.png)


4) 아래로 스크롤하여 [Scopes] - [Bot Token Scopes]에서 [Add on OAuth Scope]를 선택합니다. 


![noname](https://user-images.githubusercontent.com/52392004/172078038-6aefa76b-b001-49b5-a574-26bdb880c672.png)


아래로 이동해 "Chat:write"을 선택합니다. 


![noname](https://user-images.githubusercontent.com/52392004/172078059-17039824-c2c0-429d-ac57-e2fe47ffaafa.png)




5) [OAuth Tokens for Your Workspace] 에서 [Install to Workspace]를 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/172078102-9eca1c48-a226-4a95-ba90-dac9e3245b95.png)





6) [Allow] 를 선택합니다.

![noname](https://user-images.githubusercontent.com/52392004/172078132-947e6b40-601b-4e08-bb1d-67e9324da694.png)





7) 아래처럼 화면이 전환되면 [Copy]를 선택해서, [Bot User OAuth Token]을 복사 합니다. 


![noname](https://user-images.githubusercontent.com/52392004/172078210-283c786f-8910-4175-ac4f-d1b025f947bb.png)






8) 복사한 Token은 [Lambda] - [Functions] - [labda-storytime-for-slack]의 [Configuration] - [Environment variables]로 이등해서 등록하여 사용하여야 합니다.

![noname](https://user-images.githubusercontent.com/52392004/172078353-0782a885-8e0b-4a60-98ad-ab29374222df.png)




아래와 같이 "token"이라는 key로 등록합니다. 


![noname](https://user-images.githubusercontent.com/52392004/172078413-b78a1e51-f92d-42c4-bdd7-314537fa21a6.png)



소스에 토큰을 하드코딩하여 Github에 공유하면, Slack이 이를 확인하여 자동으로 해당 토큰을 정지합니다. 테스트 용도라도 토큰과 같은 중요한 정보는 Environment variable로 관리하는것이 좋습니다. 


9) Slack의 "storytime" channel에서 아래와 같이 "/invite @storybot" 이라고 입력해서 chatbot을 등록 합니다. 

![noname](https://user-images.githubusercontent.com/52392004/172078756-b40b0874-e016-4012-9208-b4f814d0c2c8.png)




10) storytime서버에 이미지를 전송하면 slat으로 아래처럼 전달되는지 확인 합니다. 


![noname](https://user-images.githubusercontent.com/52392004/172078684-2d7f6a72-4dd4-4b72-8df3-b7cd439f9b87.png)





## Troubleshooting for lambda

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

## Troubleshooting for slackapp

만약 slack app의 token이 업데이트 되어서, token을 재발급 할 경우에 아래를 따릅니다. 

1) Slack api 사이트에 접속합니다. 

https://api.slack.com/


2) 우측 상단의 Your apps를 선택하면 아래처럼 "storybot"이 나옵니다. "storybot"을 선택하여 진입합니다. 

<img width="1322" alt="image" src="https://user-images.githubusercontent.com/52392004/159929378-dca6dd8a-fb1e-4ac3-b9f8-fc5920b455be.png">

3) 왼쪽 메뉴에서 [OAuth & Permissions]을 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/159929820-5ceb3d1d-9c29-4c1a-89c7-d3422a078ec9.png)

4) [OAuth Tokens for Your Workspace]에서 새로 Token을 생성합니다. 


![noname](https://user-images.githubusercontent.com/52392004/159930098-b8d23465-803f-4b40-b07e-dcb95ee38981.png)

5) [Reinstall to Worksapce]를 선택하고 이후 나오는 화면에서 Allow를 선택합니다. 

<img width="584" alt="image" src="https://user-images.githubusercontent.com/52392004/159930225-b1f3e4f9-3797-4711-9a17-d21e9b619b87.png">


6) Slack의 해당 채팅방에서 "/invite @"을 입력하면 아래처럼 storybot이 노출 됩니다. 여기서 storybot을 등록하면 등록이 완료됩니다. 


![noname](https://user-images.githubusercontent.com/52392004/159930730-32f1b693-5b6d-464e-a9a0-c76a3fc285da.png)

만약 slack 실행시 "not_in_channel"이라는 에러 발생시 6번 과정을 다시 실행해 봅니다.
