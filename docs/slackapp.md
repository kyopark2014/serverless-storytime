# Slack으로 메시지 전송

## Slack Webhook

Slack의 대화방에 메시지를 전송하기 위해서는 Slack의 Webhook address와 Token이 필요합니다. 

1) Slack api에 접속

https://api.slack.com/apps?new_app=1

아래에서 [From scratch]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157184256-3fd1c0dc-c8a5-48bb-a4c4-9e7603e4a8f4.png)


2) [Name app & choose workspace]에서 App Name으로 "storytimeBot"으로 입력하고, [Pick a workspace to develop your app in:] 에서 현재 사용하고 있는 Slack의 Workspace를 지정한다. 여기서는 본 데모를 위해 "Storytime"이라는 workspace를 위해 생성 하였습니다. 

![image](https://user-images.githubusercontent.com/52392004/157184365-9a6a9881-49d7-4e9e-aebf-8fb24b19dc66.png)

3) [Incoming Webhooks]를 선택하고, 아래 화면이 나오면, [Activate Incoming Webhooks]를 선택해서 "Off"에서 "On"으로 바꿉니다. 

![image](https://user-images.githubusercontent.com/52392004/157184975-9210a3ab-0542-4456-a5ac-286bb5976d22.png)


4) 아래화면에서 [Add New Webhook to Workspace]를 선택합니다.

![image](https://user-images.githubusercontent.com/52392004/157185112-b9ea800b-cbb6-4e90-9022-77cb801ddbea.png)

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





