# Bulk API

Bulk API는 아래와 같이 API Gateway를 통해 "/bulk"로 기입력한 컨텐츠에 대한 정보를 조회 합니다. 컨텐츠 조회시에는 컨텐츠 업로드때 응답을 받은 eTag에서 Id를 추출하고, Body의 Timestamp를 같이 전달합니다. 

<img width="532" alt="image" src="https://user-images.githubusercontent.com/52392004/157833888-7c412481-7df4-4ba3-8e31-8c573d312ef1.png">

여러개 파일 업로드는 파일을 1개씩 올리는 경우와 동일한 Upload API를 사용하나, header에 "X-notification-required: false"를 전달해서, 매번 파일을 올릴때마다 결과가 전달되지 않도록 처리합니다. 이후 "/bulk" API에  전체에 대한 처리 결과시 아래와 같이 파일정보를 제공하면, 응답으로 결과를 얻고, 사용자에게 전체에 대한 알림도 보낼수 있습니다. 

API 호출시 전달하는 입력의 형태는 아래와 같습니다. 

```java
[
    {"Id":"6beac33f-0048-4db4-8522-518d15c3069c","Timestamp": "1646905142"},
    {"Id":"2f4c0b91-a714-4ae5-87d6-81984d9075fc","Timestamp": "1646981233"}
]
```

이후, Lambda는 DynamoDB를 Id, Timstamp를 이용해 질의하며, 얻어진 업로드 이미지와 이를 통해 추출한 음성(mp3)의 경로를 확인하여 Client 쪽으로 리턴합니다. 더불어 해당 질의는 AWS SNS를 통하여 Email과 Slack으로도 결과가 전달됩니다. 이를 위한 Lambda를 생성하는 절차는 아래와 같습니다. 

1) Lambda Console에서 "lambda-storytime-for-bulk"로 생성합니다. 

https://ap-northeast-2.console.aws.amazon.com/lambda/home?region=ap-northeast-2#/functions

2) 아래와 같이 DynamoDB, SNS Permission을 추가합니다. 

```java
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
          }
```        

3) 아래 repository에서 코드를 다운로드하여 기본 코드를 대체합니다. 

https://github.com/kyopark2014/serverless-storytime-for-bulk-interface
