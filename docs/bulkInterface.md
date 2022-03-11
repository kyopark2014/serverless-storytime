# Bulk API

1) Lambda Console에서 "lambda-storytime-for-bulk"로 생성합니다. 

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
