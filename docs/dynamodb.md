# DynamoDB

### DynamoDB Table 생성

1) AWS 콘솔 에서 Amazon DynamoDB 서비스로 이동합니다.

https://ap-northeast-2.console.aws.amazon.com/dynamodbv2/home?region=ap-northeast-2#service

![image](https://user-images.githubusercontent.com/52392004/156774129-74f40bce-a28f-42ad-b27c-fad897c2ec9e.png)

2) [DynamoDB] - [Tables] - [Create table]에서 아래와 같이 Partition key와 Sort key를 정의한다. 여기서에서는 Unique ID인 uuid를 Partition key로 사용하고, Sort key로는 item 생성시간인 timestamp를 사용하고, 이후 아래로 스크롤하여 [Create Table]을 선택한다. 

![image](https://user-images.githubusercontent.com/52392004/156883544-9affd555-58a9-4fb6-bc42-1ab9a0331bfb.png)

생성된 dyanmo table의 정보는 아래와 같습니다. Partition Key와 Sort Key가 string 타입으로 설정되었습니다. 

![image](https://user-images.githubusercontent.com/52392004/156787695-1074062c-8b30-424b-9533-14c83592e027.png)

3) Secondary indexes를 설정하기 위해서, [DynamoDB] - [Tables] - [dynamodb-image-duplication-checker]의 [Indexes]에서 [Create index]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/156795261-3adf533f-7b4c-4d5f-994c-5143cebfc7a6.png)

아래와 같이 Global secondary index로 "ContentID"를 입력하고 아래로 스크롤하여 [Create Index]를 선택합니다. 
![image](https://user-images.githubusercontent.com/52392004/156796028-50ef2254-ea33-4759-9ba6-a7c243cd4246.png)


4) billing 방식을 On-demand로 바꾸기 위하여, 아래와 같이 [Actions]에서 [Edit capacity]를 선택합니다.

![image](https://user-images.githubusercontent.com/52392004/156797590-a2f4d225-8869-42e3-84bc-831f47b8159f.png)

Capacity mode를 [On-demand]로 선택후, [Save changes]를 선택하여 변경합니다. 

![image](https://user-images.githubusercontent.com/52392004/156798089-884a17bc-5cec-49c1-8649-5e8616083bc4.png)
