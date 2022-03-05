# 6. Lambda for Polly 구현

 
1) Lambda console에서 [Functions] - [Create function]을 선택하여, [Basic information]에서 [Function name]으로 아래와 같이 “lambda-storytime-for-polly”을 입력하고, [Create function]을 선택하여 생성합니다. 

https://ap-northeast-2.console.aws.amazon.com/lambda/home?region=ap-northeast-2#/create/function


![image](https://user-images.githubusercontent.com/52392004/156881934-194962c4-a3de-45e6-9c5f-fd121511f64d.png)



2) [AWS Lambda] - [Functions] - [lambda-storytime-for-polly]에서 [Configuration] - [Permission]을 선택한후, [Execution role]에서 “lambda-storytime-for-polly-role-06m8ylai”을 선택하여 진입합니다. 


![image](https://user-images.githubusercontent.com/52392004/156881970-073715f6-d6c0-4b26-9a97-1aaae088c38e.png)


3) [IAM] - [Roles]로 화면이 전환된 후에, 아래와 같이 [Permissions policies]에서 “AWSLambdaBasicExecutionRole-1e7aac03-21ad-4d81-89c9-3416cb2d7277”을 선택합니다. 


![noname](https://user-images.githubusercontent.com/52392004/156882220-f4006da7-77ea-44d4-aa23-e5bdc14276c0.png)



4) [IAM] - [Policies]로 전환된 후, 새로 생성한 Lambda의 Policy를 수정하기 위하여 아래와 같이 [Ediit policy]를 눌러서, 수정화면으로 이동합니다. 이후 아래와 같이 Polly, SQS, SNS, S3에 대한 Permission을 삽입합니다. 여기서 Polly가 S3에 mp3 파일을 저장하기 위하여 S3에 대한 write 퍼미션이 필요합니다. 이때, Resources는 "*"로 하여야 합니다. 

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
            "Resource": "arn:aws:sqs:ap-northeast-2:****:sqs-storytime-for-polly"
        },
        {
            "Effect": "Allow",
            "Action": [
                "sns:Publish",
                "sns:Subscribe",
                "sns:CreateTopic",
                "sns:GetTopicAttributes",
                "sns:SetTopicAttributes",
                "sns:TagResource",
                "sns:UntagResource",
                "sns:ListTagsForResource",
                "sns:ListSubscriptionsByTopic"
            ],
            "Resource": "arn:aws:sns:ap-northeast-2:****:sns-storytime"
        },
        {
            "Effect": "Allow",
            "Action": "polly:*",
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
        }
```        



![noname](https://user-images.githubusercontent.com/52392004/156882069-aa3dc4bc-3977-4720-a6ca-d00ef941043c.png)




5. AWS Lambda console로 이동하여, [Functions] - [lambda-storytime-for-polly]의 [Code]에서 [Upload form]을 선택하여, “deploy.zip” 파일을 업로드 합니다. 업로드후 자동으로 Deply 되지만, 코드 수정시에는 [Deploy] 버튼을 눌러서 수동으로 Deploy 하여야 합니다.  관련된 코드는 아래와 같이 clone 하여 사용 합니다. 


```c
$ git clone https://github.com/kyopark2014/serverless-storytime-for-polly 
```
해당 repository에는 이미 압축된 파일이 있지만, 추후 수정시 폴더로 이동하여 압축을 합니다. 이때 압축 명령어는 아래와 같습니다.

```c
$ zip -r deploy.zip *
```

9) Lambda console에서 [Functions] - [lambda-storytime-for-polly]을 선택한후, 코드를 업로드 합니다.

[Upload from] 버튼을 누른후에 아래처럼 [.zip file]을 선택합니다. 이후 다운로드한 파일에서 “deploy.zip” 을 선택합니다.

10) 업로드 후에는 자동으로 [Deploy]이 됩니다. 하지만 추후 console에서 바로 수정시에는 아래와 같이 [Deploy]를 선택하여 배포하여야 합니다.

![image](https://user-images.githubusercontent.com/52392004/156882116-b6f2b019-d60a-4ee3-8c74-9306b1777797.png)
