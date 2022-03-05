# 3. Lambda for Rekognition 구현"

1) AWS 콘솔 에서 AWS Lambda 서비스로 이동합니다.

[[Console]](https://ap-northeast-2.console.aws.amazon.com/lambda/home?region=ap-northeast-2#/functions) 

https://ap-northeast-2.console.aws.amazon.com/lambda/home?region=ap-northeast-2#/functions

2) [Create function]의 [Basic information]에서 [Function name]은 “lambda-simple-storytime-for-rekognition"으로 입력하고 [Runtime]으로 Node.js를 선택합니다. 이후 아래로 스크롤하여 [Create function]을 선택합니다.

![lambda-rekognition-1](https://user-images.githubusercontent.com/52392004/156369039-299501b3-f953-4641-b49c-ffc8923ebe22.png)

3) [Lambda] - [Funtions] - [lambda-simple-storytime-for-rekognition]에서 아래와 같이 [Configuration] - [Permissions]을 선택후, [Execution role]의 [Role name]을 아래와 같이 선택합니다. 본 워크샵의 예제에서는 아래와 같이 “lambda-simple-storytime-for-rekognition-role-7wl1cajq”을 선택합니다.

![lambda-rekognition-2](https://user-images.githubusercontent.com/52392004/156369087-e0d176ee-0d34-4dc6-b80d-43404bb5370d.png)

4) 이때 IAM의 [Roles]로 이동하는데, Policy를 수정하기 위하여 아래와 같이 [Permissions policies]에 있는 “AWSLambdaBasicExecutionRole-1970fa69-65c9-484e-8ca1-f833e69cf0e9”을 선택합니다.

![lambda-rekognition-3](https://user-images.githubusercontent.com/52392004/156369265-5b7b95b5-2e30-496d-ae01-2890345ccc65.png)

5) [IAM]의 [Policies]로 이동하면, [Permissions]에서 [Edit policy]를 선택합니다.

![lambda-rekognition-4](https://user-images.githubusercontent.com/52392004/156369312-64171e94-f214-4e11-ad23-8baeaf9eae48.png)

6) [JSON]에서 아래와 같이 SQS에 대한 퍼미션을 추가합니다. Lambda for Rekognition은 양쪽에 SQS가 2개이므로  resource에 SQS 2개를 모두 등록하여야 하며, Rekognition과 S3에 대한 Permission도 아래와 같이 추가 합니다. 아례 예시에서 "****"은 AWS 계정 번호를 다른 퍼미션과 비교하여 입력하여야 합니다. 

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
                "arn:aws:sqs:ap-northeast-2:****:sqs-simple-storytime-for-polly",
                "arn:aws:sqs:ap-northeast-2:****:sqs-simple-storytime-for-rekognition"
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
        }
```        


SQS에 대한 Permission을 추가후 [Review policy]를 선택합니다.

![lambda-rekognition-5](https://user-images.githubusercontent.com/52392004/156475580-f441617f-2e2b-4ce5-bf1e-bb8dea9e2694.png)

7) SQS에 대한 Policy를 확인후 [Save changes] 선택하여 저장합니다.

8) Rekognition을 통해 이미지로부터 추출한 텍스트를 SQS에 Json 형태로 전달하기 위한 코드를 다운로드 합니다. 아래와 같이 내려 받습니다.
 
```c
$ git clone https://github.com/kyopark2014/simple-serverless-storytime-for-rekognition
```
해당 repository에는 이미 압축된 파일이 있지만, 추후 수정시 폴더로 이동하여 압축을 합니다. 이때 압축 명령어는 아래와 같습니다.

```c
$ zip -r deploy.zip *
```

9) Lambda console에서 [Functions] - [lambda-simple-storytime-for-rekognition]을 선택한후, 코드를 업로드 합니다.

[rekognition from] 버튼을 누른후에 아래처럼 [.zip file]을 선택합니다. 이후 다운로드한 파일에서 “deploy.zip” 을 선택합니다.

10) 업로드 후에는 자동으로 [Deploy]이 됩니다. 하지만 추후 console에서 바로 수정시에는 아래와 같이 [Deploy]를 선택하여 배포하여야 합니다.


![lambda-rekognition-6](https://user-images.githubusercontent.com/52392004/156369449-0c236a9f-a2c4-4e56-b103-e0823b696c21.png)

