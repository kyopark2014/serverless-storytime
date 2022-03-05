# 6. Lambda for Polly 구현

 
1) Lambda console에서 [Functions] - [Create function]을 선택하여, [Basic information]에서 [Function name]으로 아래와 같이 “lambda-simple-storytime-for-polly”을 입력하고, [Create function]을 선택하여 생성합니다. 

https://ap-northeast-2.console.aws.amazon.com/lambda/home?region=ap-northeast-2#/create/function


![lambda-polly-1](https://user-images.githubusercontent.com/52392004/156368639-1f030e90-3a24-49fa-9fd4-afd81102fcf6.png)



2) [AWS Lambda] - [Functions] - [lambda-simple-storytime-for-polly]에서 [Configuration] - [Permission]을 선택한후, [Execution role]에서 “lambda-simple-storytime-for-polly-role-14o4htrd”을 선택하여 진입합니다. 


![lambda-polly-2](https://user-images.githubusercontent.com/52392004/156368679-779d6b63-dbb6-4e28-9ba6-867e35d9c9c0.png)




3) [IAM] - [Roles]로 화면이 전환된 후에, 아래와 같이 [Permissions policies]에서 “AWSLambdaBasicExecutionRole-13cfb78d-c91c-4e17-b7d9-5682c45d077e”을 선택합니다. 


![lambda-polly-3](https://user-images.githubusercontent.com/52392004/156368745-b84f9f28-9ef2-4932-99af-cb1972176c21.png)


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
            "Resource": "arn:aws:sqs:ap-northeast-2:677146750822:sqs-simple-storytime-for-polly"
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
            "Resource": "arn:aws:sns:ap-northeast-2:677146750822:sns-simple-storytime"
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



![lambda-polly-4](https://user-images.githubusercontent.com/52392004/156368831-80aad1dd-3f2c-4627-9cde-c4e8a484d22a.png)





5. AWS Lambda console로 이동하여, [Functions] - [lambda-simple-storytime-for-polly]의 [Code]에서 [Upload form]을 선택하여, “deploy.zip” 파일을 업로드 합니다. 업로드후 자동으로 Deply 되지만, 코드 수정시에는 [Deploy] 버튼을 눌러서 수동으로 Deploy 하여야 합니다.  관련된 코드는 아래와 같이 clone 하여 사용 합니다. 


![lambda-polly-5](https://user-images.githubusercontent.com/52392004/156368887-2b5bac2f-f3df-499c-be0a-9e7c2ac2ceb5.png)




#### 소스 설치

아래의 Repository에서 Lambda for Polly를 위한 Node.js 코드를 다운 받아 설치 합니다. 

```c
$ git clone https://github.com/kyopark2014/simple-serverless-storytime-for-polly 


