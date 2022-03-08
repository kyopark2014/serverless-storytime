# Slack으로 메시지 전송

## Slack Webhook

Slack의 대화방에 메시지를 전송하기 위해서는 Slack의 Webhook address와 Token이 필요합니다. 

1) Slack api에 접속

https://api.slack.com/apps?new_app=1

아래에서 [From scratch]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157184256-3fd1c0dc-c8a5-48bb-a4c4-9e7603e4a8f4.png)


2) [Name app & choose workspace]에서 App Name으로 "storytimeBot"으로 입력하고, [Pick a workspace to develop your app in:] 에서 현재 사용하고 있는 Slack의 Workspace를 지정한다. 여기서는 본 데모를 위해 "Storytime"이라는 workspace를 위해 생성 하였습니다. 

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

아래와 같이 "to
![noname](https://user-images.githubusercontent.com/52392004/157288667-ce95b61f-2694-4a03-8bce-e4d94e24228d.png)










5) [Where should storytimeBot post?]에서 사용할 Channel을 선택합니다. 여기서는 Slack에서 미리 생성한 "storytime" Channel을 선택하였습니다. 

![image](https://user-images.githubusercontent.com/52392004/157185380-790a19d2-f38b-4c9f-a083-1381a85b1abe.png)

6) 아래와 같이 [Copy]를 선택하여 Webhook URL을 복사합니다. 

![noname](https://user-images.githubusercontent.com/52392004/157185631-c6375929-c1e9-40ce-b907-a366c364a6f5.png)

복사된 URL은 아래와 같습니다. 

https://hooks.slack.com/services/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

7) App-Level Token 생성하기 

왼쪽 메뉴에서 [Basic Information]을 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157189524-576380db-fb29-495b-a623-3acc3c08be06.png)

아래로 스크롤하여 App-Level Tokens로 이동합니다. 

![image](https://user-images.githubusercontent.com/52392004/157189174-8ab9fdf1-c5db-4049-9ca2-a902ebb20d90.png)

[Generate Token and Scopes]를 선택후 [connection:write] 선택합니다 이후 [Generate]를 선택해서 아래와 같이 Token을 생성합니다. 

![image](https://user-images.githubusercontent.com/52392004/157189259-51e094e2-4b4b-461b-abbe-4020a384c0f3.png)


[Copy]를 선택하여 복사해 놓습니다. 

![image](https://user-images.githubusercontent.com/52392004/157189431-b6d4cdd4-3452-40d9-8c2a-838f6be02db0.png)


8) curl로 동작 확인 

```c
curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/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
```

9) Lambda에 코드 삽입하기 

```c
  	const Slack = require('slack-node'); 
  	const token = 'xoxb-3205298473938-3206320920019-XlDOg1AczKmLsn0vUWKr3ls1';
  	const slack = new Slack(token); 
  	const webhookUri = "https://hooks.slack.com/services/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"; 

	slack.setWebhook(webhookUri); 

	slack.webhook( 
	{ 
		"text": "Message from storytime to slack", 
	}, (err, response) => { 
		if (err) { console.log(response) } 
		else { console.log('slack: '+response) } 
	});
```





