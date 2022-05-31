# Sequence Diagram

여기에서는 기본동작 시나리오, 중복처리, Retrive API에 대해 Sequence diagram으로 설명합니다.

## 기본동작 시나리오

사진 전송후 AWS Rekognition과 AWS Polly를 통해 음성파일(mp3)로 전환되는 동작 시나리오는 아래의 Sequence Diagram을 참고 부탁드립니다. 

![image](https://user-images.githubusercontent.com/52392004/156918229-7af58756-a86b-405b-8053-5c1632a3989e.png)

## 중복 요청 처리

사용자가 중복으로 이미지를 등록하여 요청하거나, 인터넷에서 공유된 이미지 컨텐츠를 가지고 요청을 할 경우에 동일한 데이터에 대한 중복처리를 하면 응답을 개선하여 사용성을 좋게하고, AWS Rekognition, Polly에 대한 비용을 줄일수 있는 효과가 있습니다. 

[Normal Case - 중복인지 확인]

이미지가 Upload가 되면 Lambda는 Hashing을 통해  ContentID를 생성하고, 동일한 ContentID가 있는지, DynnamoDB를 조회합니다. 동일한 ContentID가 없다면, UUID를 생성하고, 등록된 이미지에 대한 Bucket과 Key정보를 SQS에 Event 메시지로 등록합니다. 

![image](https://user-images.githubusercontent.com/52392004/156917347-9035331b-703b-4900-b1fa-fe84721b870e.png)

[Abnormal Case - Duplicated request]

Upload된 이미지가 중복되었고, 과거에 AWS Rekognition과 AWS Polly로 계산된 결과가 있다면, DynamoDB 조회를 통해 확인 할 수 있습니다. Lambda는 UUID를 새로 생성하지 않고 이전 등록된 이미지에 대한 UUID를 User에게 전달하고, 요청을 새로 생성하지 않고 바로 SNS을 통해 Email Notification을 수행합니다.

![image](https://user-images.githubusercontent.com/52392004/156955425-c0e9dd45-58df-478c-9f75-ac3b2a256ced.png)

[Abnormal Case - Fail over]

여러가지 이유로 요청이 정상적으로 처리되지 않은 경우가 있습니다. 이 경우에 사용자가 Retrieve로 상태 확인시에 기등록된 컨텐츠가 있으나, DynamoDB에 완성된 결과가 없을 수 있습니다. 이런 경우에 DynamoDB에서 조회하여 얻은 Json(AWS Rekognition의 결과), Text(Lambda가 추출한 Text), URL(AWS Polly가 텍스트를 음성파일(MP3)로 변환하고 S3에 저장후, CloudFront을 통해 외부에서 접속 가능한 URL)을 SQS에 Event로 저장합니다. 이렇게 하면 Event는 정상적인 Event와 동일하게 흐르지만, AWS Rekognition, Lambda의 Text 추출 , AWS Polly는 해당 데이터가 있는 경우에 skip 하므로 전체적인 프로세스 개선 효과가 있습니다. 

![image](https://user-images.githubusercontent.com/52392004/156978791-d1166143-f63f-4036-94ae-69b3f9d4f008.png)

## Retrieve API

User가 Polling 하거나, 사용자 동작으로 결과 조회를 하게될 경우에 아래와 같이 Lambda가 DynamoDB를 조회하여 추출된 Text와 원본이미지, 음성파일(mp3)에 대한 URL 경로를 확인 할 수 있습니다. 

![image](https://user-images.githubusercontent.com/52392004/157040329-c4fe0b44-3f35-4660-9ce3-2aa87df79db1.png)

Abnoral Case가 발생하여, Retrieve API로 status 확인시에 결과를 확인 할 수 없는 경우가 있습니다. 아래 케이스는 Retrive로 조회시 DynamoDB에 AWS Rekognition 수행결과(Json)과 Lambda의 Text Extraction 결과(Text)는 있으나 AWS Polly가 수행한 결과가 없는 경우입니다. 이 경우에, Lambda는 User에 503 (Retry-After:60)을 전달하여 60초 후에 재시도 하도록 정보를 전달하고, SQS에 Event에 대한 정보를 전달하여, AWS Polly가 다시 Text를 음성파일(MP3)로 변환하도록 요청합니다. 이러한 과정을 통해 Fail over 처리가 가능합니다. 여기서, User가 이미지를 업로드하고 즉시 Retrieve 하는 케이스에 있다면, 중복으로 요청 될 수 있으므로, Retrieve API로 요청이 왔을때 이전 Upload Request와의 시간이 일정시간(60초)이내인 경우에만 SQS에 요청을 합니다. 


![image](https://user-images.githubusercontent.com/52392004/157040424-6bca2c8c-c58d-4a53-aa72-73510374319e.png)
