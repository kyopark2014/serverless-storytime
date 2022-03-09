# Opensearch Troubleshooting - Security

[Opensarch Dashboard](https://ap-northeast-2.console.aws.amazon.com/esv3/home?region=ap-northeast-2#opensearch/dashboard)에 접속시에 
아래와 같이 [Amazon OpenSearch Service] - [Domains] - [storytime]에서 Cluster health 진입시 403 에러가 발생할때 처리하는 방법은 아래와 같습니다. 

![noname](https://user-images.githubusercontent.com/52392004/157371708-670d8261-4992-49c4-8605-dd217adfb089.png)


1) 자신의 ARN 확인 

아래와 같이 [IAM] - [Users]에서 자신의 ARN을 확인 합니다. 

![noname](https://user-images.githubusercontent.com/52392004/157371231-db5452fe-f6b4-43d5-88ba-2f40a112068c.png)


2) OpenSearch Dashboard - [Security] 접속 

![image](https://user-images.githubusercontent.com/52392004/157371786-a9077953-29f1-4db7-83a1-a5a30a036ab5.png)

3) [Security] - [Roles]에서 "all_access"을 선택하여 들어갑니다. 

![image](https://user-images.githubusercontent.com/52392004/157371978-11a42f30-34da-4480-a780-951b1a50bdd5.png)

4) [all_access]에서 [Mapped Users]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/157372094-ac9ad42c-face-4be3-9468-2aec622d8b72.png)

5) 복사한 자신의 ARN을 아래와 같이 입력하고 [Map]을 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/157372566-7526f11b-5564-471b-a2da-a21cf30371ee.png)


6) 다시 OpenSearch Dashboard에 가서 "storytime"을 선택한후에 [Cluster health]에서 에러없이 보여지는지 확인합니다. 

![image](https://user-images.githubusercontent.com/52392004/157372335-77cccb39-edda-4e5e-b16d-a2421dfbe89d.png)


## Reference 

[[AWS] Elasticsearch — No Permissions for [cluster:monitor/health]](https://tonylixu.medium.com/aws-elasticsearch-no-permissions-for-cluster-monitor-health-19c9630454f5)
