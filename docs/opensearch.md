# OpenSearch 구성  


모니터링을 위해 Amazon OpenSearch를 아래와 같이 구성합니다. 

<img width="554" alt="image" src="https://user-images.githubusercontent.com/52392004/157412681-9537ef38-cd3f-4671-b032-52d22ad7507e.png">


## OpenSearch 설치하기 

1) Opensearch console로 이동하여 [Create domain]을 선택합니다. 

https://ap-northeast-2.console.aws.amazon.com/esv3/home?region=ap-northeast-2#opensearch

2) [Name]으로 "opensearch-storytime"을 입력합니다. 

![image](https://user-images.githubusercontent.com/52392004/157415437-b6833f20-165b-4b81-8cd5-32aee59b39d1.png)



3) [Deployment type]에서 [Development and testing]을 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157356736-3ced06a1-8475-4640-b527-09faaf501952.png)


4) [Data nodes]에서 [Instance type\과 [EBS storage size per node]을 설정합니다. 

![image](https://user-images.githubusercontent.com/52392004/157356852-c659357b-233c-459d-a493-84220b6d903a.png)


5) [Network]로 "Public access"를 선택합니다. 외부에서 접속을 제한 할 경우에는 "VPC access]로 설정할 수 있습니다. 

"Enable fine-grained access control"선택하고 "Create master user"로 설정한후 Master ID/Password를 설정합니다. 

![image](https://user-images.githubusercontent.com/52392004/157357235-3353eb77-566a-4dc4-ac70-61cf912a603f.png)


6) [Access policy]는 아래와 같이 [Configure domain level access policy]를 선택하고 [Action]을 "Deny"에서 "Allow"로 변경합니다. 

![image](https://user-images.githubusercontent.com/52392004/157415719-2230de0d-2c09-4b0a-896b-06f415a0a63b.png)


7) 나머지 설정은 유지하고 [Create] 버튼을 눌려서 Opensearch를 생성합니다. 



## OpenSearch 설정하기 

1) OpenSearch 설치가 완료되면 [OpenSearch Dashboards URL]을 선택하여 접속합니다. 

![noname](https://user-images.githubusercontent.com/52392004/157425382-172f5b41-f03e-45d7-abc7-ceab7963d8e5.png)

2) 왼쪽 메뉴에서 [Security]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157425608-2f7a0858-9bae-42cb-96d8-a703a4e07293.png)

3) [Roles]에서 "all_access"를 선택해서 진입합니다. 

![image](https://user-images.githubusercontent.com/52392004/157425788-a2ee2137-2f7a-4b24-b67a-ef35a1c14fba.png)

4) [all_access]에서 [Mapped users]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157425947-9a9fe333-7668-4d14-bf21-263d71c91948.png)

5) [Manage mapping]을 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157426497-ae1f1e99-ce10-4277-b86b-8d0643fec9d9.png)

6) [Users]에 아래 2개의 계정을 추가합니다. 사용자의 arn은 IAM에서 확인 할수 있습니다. 

arn:aws:iam::677146750822:user/ksdyb.park 

arn:aws:iam::677146750822:role/Opensearch-storytime





![image](https://user-images.githubusercontent.com/52392004/157073630-385953ec-29ab-4b43-85af-54fa32e436c8.png)


![image](https://user-images.githubusercontent.com/52392004/157073798-e5686ab1-40b6-4960-b630-cad9f071333e.png)


![image](https://user-images.githubusercontent.com/52392004/157073880-24513c94-9943-46e9-9097-a092e942079a.png)


![image](https://user-images.githubusercontent.com/52392004/157074468-26fe4a7b-f9d4-4721-9a10-0f08cbf16e95.png)

arn:aws:iam::677146750822:role/Opensearch-storytime


![image](https://user-images.githubusercontent.com/52392004/157074651-10c913ac-4aa4-4361-9a38-29637c0bc290.png)

![image](https://user-images.githubusercontent.com/52392004/157074747-0c21c2a2-3db5-45b7-a938-411a440ab802.png)

10) CloudWatch에서 Subscription

[CloudWatch] - [Log groups]로 이동합니다. 

https://ap-northeast-2.console.aws.amazon.com/cloudwatch/home?region=ap-northeast-2#logsV2:log-groups

![image](https://user-images.githubusercontent.com/52392004/157354820-9b08753a-b3b7-47de-ba37-43ff36b21269.png)

[Actions] - [Subscription filters] - [Create Amazon OpenSearch Service subscription filter]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157355099-eb86b87f-4cdb-4d39-81d2-c7ddb42bcf7c.png)

[Choose destination] - [Amazon OpenSearch Service cluster]에서 "opensearch-storytime"을 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157355249-6fc15ac0-d172-4f50-9909-7fea2c27a4ae.png)

[Configure log format and filters]는 "Amazon Lambda"를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157355366-84b0f8e0-9468-4dbb-a4a3-47b7743015b3.png)





