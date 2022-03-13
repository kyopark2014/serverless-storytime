# CDK

장기적으로 인프라를 관리하기 위해서는 IaC(Infrastructure as Code) 툴이 필요합니다. 여기서는 Amazon CDK를 이용해 순쉽게 인프라를 관리하는 방법에 대해 소개 합니다. 

## 서비스 Module 배치 순서 

Console에서 구현시에는 API Gateway - Lambdas - SQS - SNS - DynamoDB - S3 등 먼저 연결되는 모듈을 먼저 만들고 독립된 모듈을 넣는것이 순서적으로 편리한데, CDK에서는 SQS - SNS - DynamoDB - S3 - Lambdas - API Gateway의 순서로 독립된 모듈을 먼저 놓고 연결되는 모듈을 넣는것이 좋습니다. 

여기서는 CDK V2으로 개발하였고, 개발언어로는 Typescript를 사용하였습니다. CDK이외의 각 Lambda는 독립된 언어로 포팅이 가능합니다. 여기서는 Lamadas는 Node.js로 구현합니다. 

#### Import CDK V2

CDK init시에 기본설치되는 코드는 V2기준인데, 아직 대부분의 레퍼런스들은 V1기준입니다. V1으로 작성된 코드를 그대로 가져오면 일부 동작안하는 케이스가 있으므로 주의합니다. 

```java
const sqs = require('aws-cdk-lib/aws-sqs');
const {SqsEventSource} = require('aws-cdk-lib/aws-lambda-event-sources');
const {SnsEventSource} = require('aws-cdk-lib/aws-lambda-event-sources');
const sns = require('aws-cdk-lib/aws-sns');
const subscriptions = require('aws-cdk-lib/aws-sns-subscriptions');
const lambda = require('aws-cdk-lib/aws-lambda');
const apiGateway = require('aws-cdk-lib/aws-apigateway');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
const s3 = require('aws-cdk-lib/aws-s3');
const iam = require('aws-cdk-lib/aws-iam');
```

#### Amazon SQS

Lambda에서 SQS 호출시에는 URL을 사용하는데, CDK에서는 SQS 정의시에 URL이 생성되므로 아래와 같이 queUrl을 인수로 받아서 사용하여야 합니다. 

```java
// SQS - Rekognition
    const queueRekognition = new sqs.Queue(this, 'QueueRekognition');

    new cdk.CfnOutput(this, 'sqsRekognitionUrl', {
      value: queueRekognition.queueUrl,
      description: 'The url of the Rekognition Queue',
    });
    
    // SQS - Polly
    const queuePolly = new sqs.Queue(this, 'QueuePolly');
    
    new cdk.CfnOutput(this, 'sqsPollyUrl', {
      value: queuePolly.queueUrl,
      description: 'The url of the Polly Queue',
    });

    // SQS - Opensearch
    const queueOpensearch = new sqs.Queue(this, 'QueueOpensearch');

    new cdk.CfnOutput(this, 'sqsOpensearchUrl', {
      value: queueOpensearch.queueUrl,
      description: 'The url of the Opensearch Queue',
    });
```

### Amazon SNS

Lambda가 SNS topic 호출시 ARN을 사용하는데, 아래와 같이 topicArn을 이용합니다. topic에 대한 subscription은 아래와 같이 "aws-sns-subscriptions"을 import하여 구현할 수 있습니다. 

```java
  const topic = new sns.Topic(this, 'sns-storytime', {
      topicName: 'sns-storytime'
    });
    topic.addSubscription(new subscriptions.EmailSubscription('storytimebot21@gmail.com'));

    new cdk.CfnOutput(this, 'snsTopicArn', {
      value: topic.topicArn,
      description: 'The arn of the SNS topic',
    });
```

### DynamoDB

아래와 같이 DynamoDB의 partition key와 sort key를 정의하여 인덱싱을 위해 GSI도 등록합니다. 

``` DynamoDB
    const dataTable = new dynamodb.Table(this, 'dynamodb-storytime', {
      tableName: 'dynamodb-storytime',
        partitionKey: { name: 'Id', type: dynamodb.AttributeType.STRING },
        sortKey: { name: 'Timestamp', type: dynamodb.AttributeType.STRING },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        // readCapacity: 1,
        // writeCapacity: 1,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    dataTable.addGlobalSecondaryIndex({ // GSI
      indexName: 'ContentID-index',
      partitionKey: { name: 'ContentID', type: dynamodb.AttributeType.STRING },
    });
```


### S3

아래와 S3의 Bucket을 정의하고, 외부 접속을 disable할 수 있습니다. Lambda가 이용하는 bucket이름도 아래처럼 bucketName을 이용하여 인자로 사용합니다. 

```java
  const s3Bucket = new s3.Bucket(this, "cdk-s3-storytime",{
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publicReadAccess: false,
      versioned: false,
    });

    new cdk.CfnOutput(this, 'bucketName', {
      value: s3Bucket.bucketName,
      description: 'The nmae of bucket',
    });
```

### Lambda

CDK에서 Lambda정의시 아래처럼 repositories에 git code를 넣어두면, Lambda 생성시 모든 코드를 자동으로 올려줍니다. 이때 Lambda에서 필요한 SQS URL, SNS ARN(topic), bucket이름을 Environment로 등록할 수 이씃ㅂ니다. 

```java
// Lambda - Upload
    const lambdaUpload = new lambda.Function(this, "LambdaUpload", {
      runtime: lambda.Runtime.NODEJS_14_X, 
      code: lambda.Code.fromAsset("repositories/lambda-storytime-for-upload"), 
      handler: "index.handler", 
      timeout: cdk.Duration.seconds(10),
      environment: {
        sqsRekognitionUrl: queueRekognition.queueUrl,
        sqsOpensearchUrl: queueOpensearch.queueUrl,
        topicArn: topic.topicArn,
        bucket: s3Bucket.bucketName
      }
    });  
```


Lambda가 SQS, SNS, S3와 연결은 아래와 같이 수행합니다. 이때 퍼미션을 read, write, readwrite로 부여할 수 있습니다. 

```java
    queueRekognition.grantSendMessages(lambdaUpload);
    queueOpensearch.grantSendMessages(lambdaUpload);
    dataTable.grantReadWriteData(lambdaUpload);
    topic.grantPublish(lambdaUpload);
    s3Bucket.grantReadWrite(lambdaUpload);
```

### Rekognition, Polly 퍼미션 설정 

Rekognition과 Polly는 별도 정의하지 않으므로 아래와 같이 퍼미션을 직접 추가합니다. 

Rekognition에 대한 퍼미션은 아래와 같습니다. 

```java
  // create a policy statement
    const RekognitionPolicy = new iam.PolicyStatement({
      actions: ['rekognition:*'],
      resources: ['*'],
    });
    // add the policy to the Function's role
    lambdaRekognition.role?.attachInlinePolicy(
      new iam.Policy(this, 'rekognition-policy', {
        statements: [RekognitionPolicy],
      }),
    );
```

Polly에 대한 퍼미션은 아래와 같습니다. 

```java
// create a policy statement
    const PollyPolicy = new iam.PolicyStatement({
      actions: ['polly:*'],
      resources: ['*'],
    });
    // add the policy to the Function's role
    lambdaPolly.role?.attachInlinePolicy(
      new iam.Policy(this, 'polly-policy', {
        statements: [PollyPolicy],
      }),
    );
````


### API Gateway

API Gateway는 아래와 같이 선언하고 upload와는 POST method를 사용하도록 설정하고, retrieve, bulk는 GET을 사용할 수 있도록 설정할 수 있습니다. 

```java
  // API Gateway
    const api = new apiGateway.RestApi(this, 'api-storytime', {
      description: 'API Gateway',
      endpointTypes: [apiGateway.EndpointType.REGIONAL],
      deployOptions: {
        stageName: 'dev',
      },
      proxy: false
    });    
    const upload = api.root.addResource('upload');
    upload.addMethod('POST', new apiGateway.LambdaIntegration(lambdaUpload)); 
    
    const retrieve = api.root.addResource('retrieve');
    retrieve.addMethod('GET', new apiGateway.LambdaIntegration(lambdaRetrieve)); 

    const bulk = api.root.addResource('bulk');
    bulk.addMethod('GET', new apiGateway.LambdaIntegration(lambdaBulk); 

```
