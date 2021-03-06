
# 10. Lambda for Retrieve 구현

1) AWS 콘솔 에서 AWS Lambda 서비스로 이동합니다.

https://ap-northeast-2.console.aws.amazon.com/lambda/home?region=ap-northeast-2#/functions

2) [Create function]의 [Basic information]에서 [Function name]은 “lambda-storytime-for-retrieve"으로 입력하고 [Runtime]으로 Node.js를 선택합니다. 이후 아래로 스크롤하여 [Create function]을 선택합니다.
 
![image](https://user-images.githubusercontent.com/52392004/156931907-c32800ef-fe1b-483c-8920-6440c81625de.png)


3) [Lambda] - [Funtions] - [lambda-storytime-for-upload]에서 아래와 같이 [Configuration] - [Permissions]을 선택후, [Execution role]의 [Role name]을 아래와 같이 선택합니다. 본 워크샵의 예제에서는 아래와 같이 “lambda-storytime-for-retrieve-role-a5oy9ar2”을 선택합니다.

![image](https://user-images.githubusercontent.com/52392004/156931965-5e0c4780-9954-4a37-a515-76370c74d8c4.png)

4) 이때 IAM의 [Roles]로 이동하는데, Policy를 수정하기 위하여 아래와 같이 [Permissions policies]에 있는 “AWSLambdaBasicExecutionRole-a136d4a6-8bdf-48fe-b35c-dd37db1bddeb”을 선택합니다.

![noname](https://user-images.githubusercontent.com/52392004/156932050-f41d0dcc-162d-4364-ae22-c5a83fc80fca.png)



5) [IAM]의 [Policies]로 이동하면, [Permissions]에서 [Edit policy]를 선택합니다.

![Edit Policy](https://user-images.githubusercontent.com/52392004/156359595-e8f4244a-2a2b-4d23-a07c-17acb71c7a0a.png)


6) [JSON]에서 아래와 같이 SQS, DynamoDB에 대한 퍼미션을 추가합니다. Permission은 향후 필요에 따라 원하는 범위로 조정할 수 있습니다. 아례 예시에서 "****"은 AWS 계정 번호를 다른 퍼미션과 비교하여 입력하여야 합니다. 

```java
        {
            "Effect": "Allow",
            "Action": [
              "sqs:SendMessage",
              "sqs:DeleteMessage",
              "sqs:ChangeMessageVisibility",
              "sqs:ReceiveMessage",
              "sqs:TagQueue",
              "sqs:UntagQueue",
              "sqs:PurgeQueue",
              "sqs:GetQueueAttributes"
            ],
            "Resource": "arn:aws:sqs:ap-northeast-2:****:sqs-storytime-for-rekognition"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:BatchGetItem",
                "dynamodb:GetItem",
                "dynamodb:Scan",
                "dynamodb:Query",
                "dynamodb:BatchWriteItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem"
            ],
            "Resource": "arn:aws:dynamodb:ap-northeast-2:****:table/*"
        }
```
S3와 SQS에 대한 Permission을 추가후 [Review policy]를 선택합니다.

![noname](https://user-images.githubusercontent.com/52392004/156932158-f1f46d56-4980-4e66-8d01-15134ab08f1d.png)



7) Policy 확인후 [Save changes] 선택하여 저장합니다.

8) 아래와 같이 소스를 내려 받습니다.
 
```c
$ git clone https://github.com/kyopark2014/serverless-storytime-for-retrieve
```

해당 repository에는 이미 압축된 파일이 있지만, 추후 수정시 폴더로 이동하여 압축을 합니다. 이때 압축 명령어는 아래와 같습니다.

```c
$ zip -r deploy.zip *
```

9) Lambda console에서 [Functions] - [lambda-storytime-for-retrieve]을 선택한후, 코드를 업로드 합니다.

[Upload from] 버튼을 누른후에 아래처럼 [.zip file]을 선택합니다. 이후 다운로드한 파일에서 “deploy.zip” 을 선택합니다.

10) 업로드 후에는 자동으로 [Deploy]이 됩니다. 하지만 추후 console에서 바로 수정시에는 아래와 같이 [Deploy]를 선택하여 배포하여야 합니다.


![image](https://user-images.githubusercontent.com/52392004/156932286-7150ea09-d05f-4a66-9726-0102ef0cb982.png)

