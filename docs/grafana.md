## Grafana 설정

1) Grafana Console에 접속하여, [Create workspace]를 선택합니다. 

https://ap-northeast-2.console.aws.amazon.com/grafana/home?region=ap-northeast-2#/

<img width="351" alt="image" src="https://user-images.githubusercontent.com/52392004/158274218-357fcbe4-5e05-4ac0-8e1e-90d7be0892db.png">

2) [Workspace name]에 "storytime"을 입력하고 [Next]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/158274423-ba56d7b9-7042-4f47-b1cf-b19e40cd9ed3.png)

3) [AWS Singe Sign-o]을 선택후 이메일 주소를 등록합니다. 
![image](https://user-images.githubusercontent.com/52392004/158274490-d7900722-e2e8-4d12-930e-e49dde347408.png)

![image](https://user-images.githubusercontent.com/52392004/158274868-364b1ff0-b7b2-4d33-b847-02ca56c6fcaa.png)

4) [Service managed]로 Permission type이 설정되었는지 확인후 Next를 누릅니다. 

![image](https://user-images.githubusercontent.com/52392004/158274798-903a5bb3-e8bc-4c43-a375-c42cf8b30fac.png)


5) 왼쪽의 "Step 3 Service managed permission settings"를 선택후 [Amazon CloudWatch]를 선택한 후에 [Next]를 선택합니다. 


6) 설정 확인후 [Create workspace]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/158275320-8cad380f-c07c-4831-8e0f-8e3382875b3d.png)

7) 완료된 화면은 아래와 같습니다. 

![image](https://user-images.githubusercontent.com/52392004/158275516-4067c020-9a4d-4083-b6cc-ef3801eb10ec.png)


8) SSO를 사용하기 위하여 아래와 같이 AWS Control Tower를 등록합니다. 

https://github.com/kyopark2014/serverless-storytime/blob/main/docs/sso.md

9) [Amazon Grafana] - [Workspace] - [storytime] - [AWS Single Sign-On (AWS SSO)] - [Assign user]에 접속하여 아래와 같이 설정확인을 하고 [Assign users and groups]을 합니다. 


![noname](https://user-images.githubusercontent.com/52392004/158282733-77db9353-156a-42a3-9cf2-a2fcbe2ebcdc.png)

아래와 같이 AWS Sing Sign-On이 Enabled로 변경됩니다.

![noname](https://user-images.githubusercontent.com/52392004/158282882-c3a4e621-1603-4a4d-97fa-8ec1b0dd55dd.png)

10) [Grafana workspace URL]을 선택하여 Grafana에 진입합니다. 

![image](https://user-images.githubusercontent.com/52392004/158276132-b7e33b04-945b-45d8-aeab-f461cae6b6ba.png)


