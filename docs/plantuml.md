# Plant UML

Visual Studio Code에서 plantuml을 사용하는것을 가이드하고자 합니다. 

1) PlantUML을 Marketplace에서 다운로드하여 설치 

아래 그림과 같이 Visual Studio Code에서 PlatUML을 검색하여 "PlatUML"을 설치합니다. 
![image](https://user-images.githubusercontent.com/52392004/156680810-482a405d-ad3a-4970-bb59-71ef3f495a7e.png)

2) UML Preview 이용하기 

sequanceDiagram.puml 파일을 생성합니다. 
해당 파일에 들어가서 마우스 우클릭하여 아래와 같이 "Preview Current Diagram"을 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/156681010-6bd3b473-5daa-4dba-a91a-41df440d0640.png)


### Example: sequance.puml
```java
@startuml Sequence Diagram - Sprites

!define AWSPuml https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/master/dist
!includeurl AWSPuml/AWSCommon.puml
!includeurl AWSPuml/Compute/all.puml
!includeurl AWSPuml/Mobile/APIGateway.puml
!includeurl AWSPuml/General/InternetGateway.puml
!includeurl AWSPuml/Database/DynamoDB.puml
!includeurl AWSPuml/Database/ElastiCache.puml
!includeurl AWSPuml/Storage/SimpleStorageServiceS3.puml

skinparam participant {
    BackgroundColor AWS_BG_COLOR
    BorderColor AWS_BORDER_COLOR
}

hide footbox

actor User as user
participant "<color:#red><$APIGateway>\nAmazon API Gateway" as api
participant "<color:#D86613><$Lambda></color>\nAmazon Lambda" as lambda
participant "<color:#3B48CC><$DynamoDB></color>\nAmazon DynamoDB" as dynamoDB
participant "<color:#green><$SimpleStorageServiceS3></color>\nAmazon S3" as s3

user -> api: Upload Image\nPOST /upload

api -> lambda ++: Invokes lambda

lambda -> lambda: Hash image to make ContentID

lambda -> dynamoDB ++ : query ContentID
dynamoDB -> lambda -- : 200OK (empty)

lambda -> s3 ++: putObject
s3 -> lambda --:
 
lambda -> lambda : generate UUID

lambda -> dynamoDB ++ : putItem ContentID, UUID
dynamoDB -> lambda -- :

lambda -> api --: 200OK (UUID)
api -> user: 200OK (UUID)

@enduml
```

### Result

![image](https://user-images.githubusercontent.com/52392004/156871212-7c8afc29-65ec-49ff-bc39-2802a1d903ef.png)

## AWS Symbol 확인

https://github.com/awslabs/aws-icons-for-plantuml/blob/master/AWSSymbols.md


## TroubleShooting
아래와 같이 java runtime 오류가 발생하면, https://java.com/en/download/apple.jsp 를 방문하여 Java for Mac을 설치 합니다. 

![image](https://user-images.githubusercontent.com/52392004/156681250-bf2abee3-a502-43d4-9396-6d117369207c.png)
