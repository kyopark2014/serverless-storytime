# DynamoDB

### DynamoDB Table 생성

1) AWS 콘솔 에서 Amazon DynamoDB 서비스로 이동합니다.

https://ap-northeast-2.console.aws.amazon.com/dynamodbv2/home?region=ap-northeast-2#service

![image](https://user-images.githubusercontent.com/52392004/156774129-74f40bce-a28f-42ad-b27c-fad897c2ec9e.png)

2) [DynamoDB] - [Tables] - [Create table]에서 아래와 같이 Partition key와 Sort key를 정의한다. 여기서에서는 Unique ID인 uuid를 Partition key로 사용하고, Sort key로는 item 생성시간인 timestamp를 사용하고, 이후 아래로 스크롤하여 [Create Table]을 선택한다. 

![image](https://user-images.githubusercontent.com/52392004/156883544-9affd555-58a9-4fb6-bc42-1ab9a0331bfb.png)


3) Secondary indexes를 설정하기 위해서, [DynamoDB] - [Tables] - [dynamodb-storytime]의 [Indexes]에서 [Create index]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/156883648-0e1eb8e1-6988-491b-9a89-77c751de4334.png)


아래와 같이 Global secondary index로 "ContentID"를 입력하고 아래로 스크롤하여 [Create Index]를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/156883683-9840e017-dbd6-40f2-8458-e2d6c2a4efa1.png)



4) billing 방식을 On-demand로 바꾸기 위하여, 아래와 같이 [Actions]에서 [Edit capacity]를 선택합니다.

![image](https://user-images.githubusercontent.com/52392004/156883762-1b15fa75-56e4-41e6-922d-220b6e2af39b.png)


Capacity mode를 [On-demand]로 선택후, [Save changes]를 선택하여 변경합니다. 

![image](https://user-images.githubusercontent.com/52392004/156883784-70135e79-6563-44b4-9c38-a74fe16cbd15.png)
