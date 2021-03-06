# 3. Lambda for Rekognition 구현

1) AWS 콘솔 에서 AWS Lambda 서비스로 이동합니다.

https://ap-northeast-2.console.aws.amazon.com/lambda/home?region=ap-northeast-2#/functions

2) [Create function]의 [Basic information]에서 [Function name]은 “lambda-storytime-for-rekognition"으로 입력하고 [Runtime]으로 Node.js를 선택합니다. 이후 아래로 스크롤하여 [Create function]을 선택합니다.

![image](https://user-images.githubusercontent.com/52392004/156881409-03a1dba9-cd7b-46b7-8a47-9b419dbcb4d4.png)



3) [Lambda] - [Funtions] - [lambda-storytime-for-rekognition]에서 아래와 같이 [Configuration] - [Permissions]을 선택후, [Execution role]의 [Role name]을 아래와 같이 선택합니다. 본 예제에서는 아래와 같이 “lambda-storytime-for-rekognition-role-mhqg6nhd”을 선택합니다.

![image](https://user-images.githubusercontent.com/52392004/156881442-561a1813-3ecf-4416-85a7-0d9a9d2bd067.png)


4) 이때 IAM의 [Roles]로 이동하는데, Policy를 수정하기 위하여 아래와 같이 [Permissions policies]에 있는 “AWSLambdaBasicExecutionRole-6f67311b-1428-46ed-9597-2c0ce5888fa5”을 선택합니다.

![noname](https://user-images.githubusercontent.com/52392004/156881513-e5ca94ad-a936-4b15-97fc-872125117d9f.png)


5) [IAM]의 [Policies]로 이동하면, [Permissions]에서 [Edit policy]를 선택합니다.

![noname](https://user-images.githubusercontent.com/52392004/156881563-1c253ccf-0896-4bbd-a1fd-8c93e88b318d.png)


6) [JSON]에서 아래와 같이 SQS, Rekognition, S3, DynamoDB에 대한 퍼미션을 추가합니다. Lambda for Rekognition은 양쪽에 SQS가 2개이므로 resource에 SQS 2개를 모두 등록하여야 합니다. 아례 예시에서 "****"은 AWS 계정 번호를 다른 퍼미션과 비교하여 입력하여야 합니다. 

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
            "Resource": [
                "arn:aws:sqs:ap-northeast-2:****:sqs-storytime-for-polly",
                "arn:aws:sqs:ap-northeast-2:****:sqs-storytime-for-rekognition"
            ]
        },
        {
            "Effect": "Allow",
            "Action": "rekognition:*",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:Put*",
                "s3:Get*",
                "s3:List*",
                "s3:Delete*"
            ],
            "Resource": "*"
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


SQS에 대한 Permission을 추가후 [Review policy]를 선택합니다.

![noname](https://user-images.githubusercontent.com/52392004/156881636-83c3c4de-f4c7-4133-9ef5-c9553c408609.png)



7) SQS에 대한 Policy를 확인후 [Save changes] 선택하여 저장합니다.

8) Rekognition을 통해 이미지로부터 추출한 텍스트를 SQS에 Json 형태로 전달하기 위한 코드를 다운로드 합니다. 아래와 같이 내려 받습니다.
 
```c
$ git clone https://github.com/kyopark2014/serverless-storytime-for-rekognition
```
해당 repository에는 이미 압축된 파일이 있지만, 추후 수정시 폴더로 이동하여 압축을 합니다. 이때 압축 명령어는 아래와 같습니다.

```c
$ zip -r deploy.zip *
```

9) Lambda console에서 [Functions] - [lambda-storytime-for-rekognition]을 선택한후, 코드를 업로드 합니다.

[Upload from] 버튼을 누른후에 아래처럼 [.zip file]을 선택합니다. 이후 다운로드한 파일에서 “deploy.zip” 을 선택합니다.

10) 업로드 후에는 자동으로 [Deploy]이 됩니다. 하지만 추후 console에서 바로 수정시에는 아래와 같이 [Deploy]를 선택하여 배포하여야 합니다.


![image](https://user-images.githubusercontent.com/52392004/156881696-a75e958f-ca96-42e0-96bc-7c59f69bf30d.png)


### Troubleshooting: Time out으로 이미지에서 텍스트 추출이 안되는 경우

[Lambda] - [Functions] - [labmda-storytime-for-rekognition]의 [Configuration] - [General configuration]에서 Lambda는 사용하는 Timeout 값을 확인할 수 있습니다. 
아래와 같이 Lambda의 기본값은 3초 입니다.

![image](https://user-images.githubusercontent.com/52392004/157043508-56ba5904-2eac-4bcf-b360-c85e490f3675.png)

그러나 Lambda가 event를 처리하는 시간이 3초를 초과한다면 해당 event 처리를 완료하지 못할 수 있습니다. 아래는 Lambda for Rkognition의 CloudWatch로그로서 event 처리시간이 3초를 초과하여 timeout이 발생하였습니다. 

![noname](https://user-images.githubusercontent.com/52392004/157044563-acece05a-081c-4b85-819b-d26922ffeff4.png)

따라서, 이런 경우에 아래와 같이 적절한 값(여기서는 10초)으로 조정하여야 합니다.

![image](https://user-images.githubusercontent.com/52392004/157043311-a3f92487-28d6-435c-9379-df92a36f9780.png)

