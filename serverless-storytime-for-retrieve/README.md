# serverless-storytime-for-retrieve

여기서는 서버리스 StoryTime의 Retrieve API를 위한 Lambda에 대해 다루고자 합니다.

### Normal Case

AWS SNS를 이용하여 email로 Notification이 알림을 받기를 원햇으나, 여러가지 원인이로 응답이 지연되거나 유실될경우에 대비하여 Client는 Retrieve 기능을 가지고 있을 수 있다. 
아래와 같이 정상적인 케이스는 Notification이 지연된 케이스이므로 DynamoDB에 저장된 컨텐츠 정보를 Client에 전달하여 Email과 같은 Notification이 없는 경우에 처리할 수 있다. 여기서 User의 요청은 RESTful API에 의해 API Gateway를 통해 Lambda가 Invoke 되는데, 이때 Client가 Content에 대한 UUID를 이용하여 DynamoDB에 현재의 상태를 질으하게 된다. 정상적인 경우라면 아래와 같이 DynamoDB 조회를 통해 얻어진 제출 이미자, 변환된 Text, 최종 음성파일을 URL을 통해 수신할 수 있다. 

![image](https://user-images.githubusercontent.com/52392004/156923089-ba7c8a79-c7c2-4fef-ab64-67785da6bef7.png)

### Abnormal Case

그러나 아래 그림과 같이 DynamoDB에 일부의 정보만 있을 경우에는 내부에 어떤 이슈가 발생한것으로 볼수 있다. 아래와 같이 DynamoDB 질의를 통해 얻어진 정보가 Json, Text파일만 있고, URL 정보가 Empty라면 아마도 Polly에 어떤 이슈가 있어서 정상적으로 데이터 처리가 안되거나 실패한것 일수 있다. 이러한 경우에 아래와 같이 SQS에 저장되는 Event에 Json, Text, URL 정보를 함께 전달하면, Rekgonition, Lambda, Polly등은 자신이 처리할 데이터가 없는 경우에 skip 하므로 중복처리를 방지하고, 처리가 안된 부분은 재시도 하게 할 수 있다. 

![image](https://user-images.githubusercontent.com/52392004/156923048-534b25bf-3a16-45c1-a32a-23abb3b2c889.png)
