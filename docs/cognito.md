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

8) 아래와 같이 [Cognito User Pool]을 선택합니다. [Callback URL]과 [Sign out URL]은 임의로 입력합니다. 또, [Allowed OAuth Flows]에서 "Authorization code grant"와 "implicit grant"을 선택하고, [Allowed OAuth Scopes]에서 모두 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/158182467-683cff77-8d33-4a1d-9477-ab982bc008da.png)

9) 왼쪽 메뉴의 [Domain name]을 선택하여 아래와 같은 화면이 나오면, [Amazon Cognito domain]에 아래와 같이 storytime이라고 입력하고 [Save changes]를 선택합니다. 

https://storytime.auth.ap-northeast-2.amazoncognito.com

10) 왼쪽 메뉴의 [App client settings]를 선택한후 아래의 [Launch Hosted UI]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/158184046-fb08affe-4a38-427d-bff9-44572ab715eb.png)

11) Sign up 화면에서 아래처럼 새로 account를 생성합니다. 

![image](https://user-images.githubusercontent.com/52392004/158184910-5d3d69fc-6a0e-496b-8c10-e980bd383f6b.png)

아래처럼 이메일 확인합니다. 

![image](https://user-images.githubusercontent.com/52392004/158185091-2ca36a29-1d71-409d-8b4d-8cc9358489d8.png)

confirmation code를 아래와 같이 입력하고, [Confirm Account]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/158185196-9068b6f2-4d35-4373-94f4-b67d66e7b6b2.png)

12) 입의로 입력한 웹페이지가 표시되면서 에러가 발생합니다. 하지만 아래의 URL에서 code를 추출할수 있는데 API Gateway에서 사용되므로 별도로 보관합니다. 

![noname](https://user-images.githubusercontent.com/52392004/158186335-6802bb11-8cdb-44f4-b234-78f80f971ced.png)

URL 정보는 아래와 같습니다.
 
```java
https://storytime.com/callback?code=56e284f2-6e7e-4452-9d4e-bc3428c529cb
```

13) 다시 왼쪽 메뉴에서 [App client settings]를 선택하여 하단의 [Launch Hosted UI]를 다시 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/158193277-8960583c-4e92-45e1-9219-e637ef42987b.png)

14) 이때, 브라우저를 선택하여 URL을 복사하면 아래와 같습니다. 

```java
https://storytime.auth.ap-northeast-2.amazoncognito.com/login?client_id=abc1c34k3smhmk6v3eh05lulc4&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://storytime.com/callback
```

여기서, "response_type=code"를 "response_type=token"으로 변경하하고, [Sign in as John]을 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/158194336-e4c59feb-e2ee-4a95-9acf-adf6687a84cb.png)

15) 다시 접속에 실패하는 화면이 나오지만 URL정보는 아래와 같습니다. 

![noname](https://user-images.githubusercontent.com/52392004/158194685-bdb78856-54a0-4a5f-88f9-9c8d92b48d0f.png)

URL 정보 

```java
https://storytime.com/callback#id_token=abcraWQiOiJKaUZYM2k2WTBMckxtYXpDXC9SUjNxTDQ0MWVpSU56bjBJSWloWjlDejFtVT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiNV9iRXIyT3hzUlpSY0k0eDFWWUhQZyIsInN1YiI6IjlmNmE5ZjdkLWU5ODYtNDUzNy1hZDMzLWMwNzdkN2Q4MjZiZSIsImF1ZCI6IjVxazFjMzRrM3NtaG1rNnYzZWgwNWx1bGM0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjQ3MjY4NTA2LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtbm9ydGhlYXN0LTIuYW1hem9uYXdzLmNvbVwvYXAtbm9ydGhlYXN0LTJfYk9XakZmU0lSIiwiY29nbml0bzp1c2VybmFtZSI6ImpvaG4iLCJleHAiOjE2NDcyNzIxMDYsImlhdCI6MTY0NzI2ODUwNiwianRpIjoiNzNmN2FkZjMtOGUwNi00NjZhLTk3NTAtOWRjMGExYzQ4NTkwIiwiZW1haWwiOiJzdG9yeXRpbWVib3QyMUBnbWFpbC5jb20ifQ.jncy2i1xsx3IrzbJes7ytWITtoNkF6bP-Uhr2IfrkcF5Ucx7hRnRbfhc4UniaKxl8osnSK37vadE_s2wP3KfSzab24m87oZbLHQevxaqR6mwiV4fKp_Un5sKbGwjGyoi6v0mM4hgROyMl55N6DyStSFOPKwAGgCS8Ns_VKLb9mJCtu1pKIUO6jvVQVcf10qgZYX76s-1Eo113q20X4lkN63YYqhOZewNTgpwXnIoXngyGl5ed-ZRDtBuVGnTzhbdMKDrHFLV0rOyZlL5-y6ObHZw_SVirHsmic0u1Hv7ifzJvTbjg02XZZn4uohikunjcUyR-22L-Q9iUe0DcCfb9Q&access_token=abcraWQiOiJaV29aRDN3cFFLSlhIRGpNU1ZpcU10VGJIZFFZc3FZV21VUEE4YVdRaXEwPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5ZjZhOWY3ZC1lOTg2LTQ1MzctYWQzMy1jMDc3ZDdkODI2YmUiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIHBob25lIG9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNjQ3MjY4NTA2LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtbm9ydGhlYXN0LTIuYW1hem9uYXdzLmNvbVwvYXAtbm9ydGhlYXN0LTJfYk9XakZmU0lSIiwiZXhwIjoxNjQ3MjcyMTA2LCJpYXQiOjE2NDcyNjg1MDYsInZlcnNpb24iOjIsImp0aSI6ImYwYTQ1OThkLWEyMDgtNDg0Yy1iMDhlLWZhZWM3YjIyNmM2YyIsImNsaWVudF9pZCI6IjVxazFjMzRrM3NtaG1rNnYzZWgwNWx1bGM0IiwidXNlcm5hbWUiOiJqb2huIn0.8UC61PHUXnZvmLjUQTt8m1ACk2IabrhWGdYTft8r7tTOb7LyTdU8wtgv2xNjilh-NKzkr5cJzWeNWEivgnogBJlUxNnhCuyDK1GnqDQ10eKY7rIU1OWcERe10UW11JTMkKj9NI7DgHNwkY4W5nsJR_TEpRWW58l9KmXNFloWFH6yTGmI9xaVJG_d3yWKXhjYsGUwuSY1xAokYV_aHnYqaHLqnSEQL0bTa5yXIohhJjn5owB5tyeL71A78IvKTGnmuoiWKii1dBpgmVOb7rbJ2wNOzAsfrD1uZHImRts9EA-CZHh57ewQE4NRMtWisCsjjUHLQ72QWtAdaWsZD5EQ_A&expires_in=3600&token_type=Bearer
```

16) 상기 URL에서 id_token과 access_token 부분만을 자르면 아래와 같습니다. 이 정보는 cognito에서 사용해야 하므로 저장해 놓습니다. 

[id-token]

abcraWQiOiJKaUZYM2k2WTBMckxtYXpDXC9SUjNxTDQ0MWVpSU56bjBJSWloWjlDejFtVT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiNV9iRXIyT3hzUlpSY0k0eDFWWUhQZyIsInN1YiI6IjlmNmE5ZjdkLWU5ODYtNDUzNy1hZDMzLWMwNzdkN2Q4MjZiZSIsImF1ZCI6IjVxazFjMzRrM3NtaG1rNnYzZWgwNWx1bGM0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjQ3MjY4NTA2LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtbm9ydGhlYXN0LTIuYW1hem9uYXdzLmNvbVwvYXAtbm9ydGhlYXN0LTJfYk9XakZmU0lSIiwiY29nbml0bzp1c2VybmFtZSI6ImpvaG4iLCJleHAiOjE2NDcyNzIxMDYsImlhdCI6MTY0NzI2ODUwNiwianRpIjoiNzNmN2FkZjMtOGUwNi00NjZhLTk3NTAtOWRjMGExYzQ4NTkwIiwiZW1haWwiOiJzdG9yeXRpbWVib3QyMUBnbWFpbC5jb20ifQ.jncy2i1xsx3IrzbJes7ytWITtoNkF6bP-Uhr2IfrkcF5Ucx7hRnRbfhc4UniaKxl8osnSK37vadE_s2wP3KfSzab24m87oZbLHQevxaqR6mwiV4fKp_Un5sKbGwjGyoi6v0mM4hgROyMl55N6DyStSFOPKwAGgCS8Ns_VKLb9mJCtu1pKIUO6jvVQVcf10qgZYX76s-1Eo113q20X4lkN63YYqhOZewNTgpwXnIoXngyGl5ed-ZRDtBuVGnTzhbdMKDrHFLV0rOyZlL5-y6ObHZw_SVirHsmic0u1Hv7ifzJvTbjg02XZZn4uohikunjcUyR-22L-Q9iUe0DcCfb9Q

[access_token]

abcraWQiOiJaV29aRDN3cFFLSlhIRGpNU1ZpcU10VGJIZFFZc3FZV21VUEE4YVdRaXEwPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5ZjZhOWY3ZC1lOTg2LTQ1MzctYWQzMy1jMDc3ZDdkODI2YmUiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIHBob25lIG9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNjQ3MjY4NTA2LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtbm9ydGhlYXN0LTIuYW1hem9uYXdzLmNvbVwvYXAtbm9ydGhlYXN0LTJfYk9XakZmU0lSIiwiZXhwIjoxNjQ3MjcyMTA2LCJpYXQiOjE2NDcyNjg1MDYsInZlcnNpb24iOjIsImp0aSI6ImYwYTQ1OThkLWEyMDgtNDg0Yy1iMDhlLWZhZWM3YjIyNmM2YyIsImNsaWVudF9pZCI6IjVxazFjMzRrM3NtaG1rNnYzZWgwNWx1bGM0IiwidXNlcm5hbWUiOiJqb2huIn0.8UC61PHUXnZvmLjUQTt8m1ACk2IabrhWGdYTft8r7tTOb7LyTdU8wtgv2xNjilh-NKzkr5cJzWeNWEivgnogBJlUxNnhCuyDK1GnqDQ10eKY7rIU1OWcERe10UW11JTMkKj9NI7DgHNwkY4W5nsJR_TEpRWW58l9KmXNFloWFH6yTGmI9xaVJG_d3yWKXhjYsGUwuSY1xAokYV_aHnYqaHLqnSEQL0bTa5yXIohhJjn5owB5tyeL71A78IvKTGnmuoiWKii1dBpgmVOb7rbJ2wNOzAsfrD1uZHImRts9EA-CZHh57ewQE4NRMtWisCsjjUHLQ72QWtAdaWsZD5EQ_A


## API Gateway 설정 

1) API Gateway Console로 이동합니다. 

https://ap-northeast-2.console.aws.amazon.com/apigateway/main/apis?region=ap-northeast-2

2) api리스트에서 "storytime"을 선택 하고, 왼쪽 메뉴에서 [Authorizers]를 선택하고, 오른족 메뉴에서 [Create New Authorizer]를 선택합니다.  

![image](https://user-images.githubusercontent.com/52392004/158190975-b28fb21f-7355-451a-a6d5-19cc21585fd7.png)

3) [Authorizers]에서 [Create Authorizer]에 "storytime"을 입력하고, [Type]은 "Cognito"를 선택합니다. 또한 [Cognito User Pool]을 선택하여 storytime을 고르고, Token Source는  "Authrization"이라고 입력후 [Create]을 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/158192422-33c0da22-c052-4892-bc50-c5110fcf49f8.png)

Create에 성공하면 아래와 같이 Cognito 정보가 표시됩니다.

![image](https://user-images.githubusercontent.com/52392004/158196932-46929127-68f2-4dd1-a7b2-70d096ea8542.png)

4) [Test] 버튼을 선택하여 [Test Authorizer]에 진입하여, Cognito에서 복사한 id_token의 값을 아래와 같이 [Autorization]에 붙여 놓습니다. 

![image](https://user-images.githubusercontent.com/52392004/158196102-287dfb07-eacf-4e54-9530-f0b0e6daca74.png)

이후 [Test]를 눌러서 인증이 성공하면 아래와 같이 계정에 대한 정보가 표시 됩니다. 

![noname](https://user-images.githubusercontent.com/52392004/158196753-49efdb9d-c51a-4684-b57d-9d85b745f767.png)

5) API에서 Cognito 인증을 사용할 수 있도록, [API]-[Resources]-[POST]에서 [Method Request]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/158199904-79c4508c-0a06-4610-a421-83106a0f68cc.png)

6) 아래와 같이 Authorization에서 "storytime"을 선택합니다. 만약 "storytime"이 노출되지 않으므로 브라우저를 refresh하고 재시도 합니다. 

![image](https://user-images.githubusercontent.com/52392004/158200139-7bab3213-620d-4db5-bdfd-e5fe6748eb17.png)

7) [Oauth Scopes]는 아래와 같이 "email"이라고 입력합니다. 

![noname](https://user-images.githubusercontent.com/52392004/158200965-00554099-890c-4200-9845-84adec7eb32f.png)

8) 수정된 사항을 적용하기 위하여 [API] - [Resources] - [POST]에서 [Actions] - [Deploy API]를 선택합니다. 이후 여기서는 [Deployment stage]를 "dev"로 입력하고 [Deploy] 버튼을 눌러서 API Gateway를 deploy 합니다. 

![noname](https://user-images.githubusercontent.com/52392004/158201472-ebf6f18b-c4be-453b-bed9-5f035db072cc.png)





## 업로드 시험 

실제 업로드시 동작을 확인하기 위하여 Postman에서 기존에 사용하던 방식으로 접속을 시도하면 아래와 같이 실패합니다. 

![image](https://user-images.githubusercontent.com/52392004/158202085-09042947-6015-4bd1-b37b-f795031dbfa0.png)

하지만, 아래와 같이 Header에 Authorization을 추가한 후, Cognito에서 얻은 access_token을 복사하여 붙이면, 아래와 같이 정상적으로 동작합니다. 

![noname](https://user-images.githubusercontent.com/52392004/158206847-121cdc80-faf0-4e6a-8e82-62d10e662c20.png)


