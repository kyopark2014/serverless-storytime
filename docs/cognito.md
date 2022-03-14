# Cognito 설정 


1) Congnito Console에 접속합니다. 

https://ap-northeast-2.console.aws.amazon.com/cognito/home?region=ap-northeast-2

![image](https://user-images.githubusercontent.com/52392004/158178235-11a10a6a-0921-493c-a5d0-c4a461a0d4ac.png)

2) [Manage User Pools]를 선택합니다. 

3) [Create a user pool]을 선택하여 [Pool name]에 "storytime"을 입력하고 [Review defaults]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/158179022-65639ad8-c731-43e3-bfd5-cfd4f7da1145.png)

4) 모든값을 유지한 상태에서 하단으로 스크롤하여 [Create pool]을 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/158179292-19f449ea-225c-41ab-b274-4308d2eaad8b.png)

5) 좌측 메뉴에서 [App clients]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/158179632-1a30586e-7012-451a-9873-aa69926a9612.png)

6) 다음에 [Add app client]를 선택후, 아래와 같이 "StorytimeClient"라고 입력하고, 아래로 다시 스크롤하여 [Create app client]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/158180157-7b206ce4-3ca6-4327-8f49-db355e3abbe5.png)

7) 왼쪽 메뉴에서 [App client settings]를 선택합니다. 

8) 아래와 같이 [Cognito User Pool]을 선택합니다. [Allowed OAuth Flows]에서 "Authorization code grant"와 "implicit grant"을 선택하고, [Allowed OAuth Scopes]에서 모두 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/158182467-683cff77-8d33-4a1d-9477-ab982bc008da.png)

9) 왼쪽 메뉴의 [Domain name]을 선택하여 아래와 같은 화면이 나오면, [Amazon Cognito domain]에 아래와 같이 storytime이라고 입력하고 [Save changes]를 선택합니다. 

https://storytime.auth.ap-northeast-2.amazoncognito.com

10) 왼쪽 메뉴의 [App client settings]를 선택한후 아래의 [Launch Hosted UI]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/158184046-fb08affe-4a38-427d-bff9-44572ab715eb.png)



