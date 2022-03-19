# CDK

장기적으로 인프라를 관리하기 위해서는 IaC(Infrastructure as Code) 툴이 필요합니다. 여기서는 Amazon CDK를 이용해 순쉽게 인프라를 관리하는 방법에 대해 소개 합니다. 

## 서비스 Module 배치 순서 

Console에서 구현시에는 API Gateway - Lambdas - SQS - SNS - DynamoDB - S3 등 먼저 연결되는 모듈을 먼저 만들고 독립된 모듈을 넣는것이 순서적으로 편리한데, CDK에서는 SQS - SNS - DynamoDB - S3 - Lambdas - API Gateway의 순서로 독립된 모듈을 먼저 놓고 연결되는 모듈을 넣는것이 좋습니다. 

여기서는 CDK V2으로 개발하였고, 개발언어로는 Typescript를 사용하였습니다. CDK이외의 각 Lambda는 독립된 언어로 포팅이 가능합니다. 여기서는 Lamada는 Node.js로 구현합니다. 

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

Lambda에서 SQS 호출시에는 URL을 사용하는데, CDK에서는 SQS 정의시에 URL이 생성되므로 아래와 같이 queueUrl을 인수로 받아서 사용하여야 합니다. 

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

아래와 같이 DynamoDB의 partition key와 sort key를 정의하고, 인덱싱을 위해 GSI도 등록합니다. 

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
      autoDeleteObjects: true,
      publicReadAccess: false,
      versioned: false,
    });
```

### Lambda

CDK에서 Lambda정의시 아래처럼 repositories에 git code를 넣어두면, Lambda 생성시 모든 코드를 자동으로 올려줍니다. 이때 Lambda에서 필요한 SQS URL, SNS ARN(topic), bucket이름을 Environment로 등록할 수 있습니다.

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
// api Gateway
    const logGroup = new logs.LogGroup(this, 'AccessLogs', {
      retention: 90, // Keep logs for 90 days
    });
    logGroup.grantWrite(new iam.ServicePrincipal('apigateway.amazonaws.com')); 

    const api = new apiGateway.LambdaRestApi(this, 'api-storytime', {
      description: 'API Gateway',
      handler: Backend,
      endpointTypes: [apiGateway.EndpointType.REGIONAL],
      binaryMediaTypes: ['*/*'],
      deployOptions: {
        stageName: stage,
        accessLogDestination: new apiGateway.LogGroupLogDestination(logGroup),
        accessLogFormat: apiGateway.AccessLogFormat.jsonWithStandardFields({
          caller: false,
          httpMethod: true,
          ip: true,
          protocol: true,
          requestTime: true,
          resourcePath: true,
          responseLength: true,
          status: true,
          user: true
        }),
      },
      proxy: false
    });   

    lambdaUpload.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));

    const templateString: string = `##  See http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
    ##  This template will pass through all parameters including path, querystring, header, stage variables, and context through to the integration endpoint via the body/payload
    #set($allParams = $input.params())
    {
    "body-json" : $input.json('$'),
    "params" : {
    #foreach($type in $allParams.keySet())
        #set($params = $allParams.get($type))
    "$type" : {
        #foreach($paramName in $params.keySet())
        "$paramName" : "$util.escapeJavaScript($params.get($paramName))"
            #if($foreach.hasNext),#end
        #end
    }
        #if($foreach.hasNext),#end
    #end
    },
    "stage-variables" : {
    #foreach($key in $stageVariables.keySet())
    "$key" : "$util.escapeJavaScript($stageVariables.get($key))"
        #if($foreach.hasNext),#end
    #end
    },
    "context" : {
        "account-id" : "$context.identity.accountId",
        "api-id" : "$context.apiId",
        "api-key" : "$context.identity.apiKey",
        "authorizer-principal-id" : "$context.authorizer.principalId",
        "caller" : "$context.identity.caller",
        "cognito-authentication-provider" : "$context.identity.cognitoAuthenticationProvider",
        "cognito-authentication-type" : "$context.identity.cognitoAuthenticationType",
        "cognito-identity-id" : "$context.identity.cognitoIdentityId",
        "cognito-identity-pool-id" : "$context.identity.cognitoIdentityPoolId",
        "http-method" : "$context.httpMethod",
        "stage" : "$context.stage",
        "source-ip" : "$context.identity.sourceIp",
        "user" : "$context.identity.user",
        "user-agent" : "$context.identity.userAgent",
        "user-arn" : "$context.identity.userArn",
        "request-id" : "$context.requestId",
        "resource-id" : "$context.resourceId",
        "resource-path" : "$context.resourcePath"
        }
    }`    
    const requestTemplates = { // path through
      "image/jpeg": templateString,
      "image/jpg": templateString,
      "application/octet-stream": templateString,
      "image/png" : templateString
    }
    
    const upload = api.root.addResource('upload');
    upload.addMethod('POST', new apiGateway.LambdaIntegration(lambdaUpload, {
      // PassthroughBehavior: apiGateway.PassthroughBehavior.NEVER,
      PassthroughBehavior: apiGateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
      requestTemplates: requestTemplates,
      integrationResponses: [{
        statusCode: '200',
      }], 
      proxy:false, 
    }), {
      methodResponses: [   // API Gateway sends to the client that called a method.
        {
          statusCode: '200',
          responseModels: {
            'application/json': apiGateway.Model.EMPTY_MODEL,
          }, 
        }
      ]
    }); 
    
    const retrieve = api.root.addResource('retrieve');
    retrieve.addMethod('GET', new apiGateway.LambdaIntegration(lambdaRetrieve, {
      PassthroughBehavior: apiGateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
      requestTemplates: {"application/json": templateString},
      integrationResponses: [
        { statusCode: '200' },
      ],
      proxy:false,
    }),{
      methodResponses: [   // API Gateway sends to the client that called a method.
        {
          statusCode: '200',
          'responseModels': {
            'application/json': apiGateway.Model.EMPTY_MODEL,
          }, 
        }
      ]
    }); 

    const bulk = api.root.addResource('bulk');
    bulk.addMethod('GET', new apiGateway.LambdaIntegration(lambdaBulk, {
      PassthroughBehavior: apiGateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
      requestTemplates: {"application/json": templateString},
      integrationResponses: [
        { statusCode: '200' },
      ],
      proxy:false,
    }),{
      methodResponses: [   // API Gateway sends to the client that called a method.
        {
          statusCode: '200',
          'responseModels': {
            'application/json': apiGateway.Model.EMPTY_MODEL,
          }, 
        }
      ]
    }); 

    new cdk.CfnOutput(this, 'apiUrl', {
      value: api.url,
      description: 'The url of API Gateway',
    });
```

## Troubleshoot: API Gateway 500에러

아래와 같이 stage variable을 사용할때 AWS Lamda를 invoke하면서 500에러가 발생하는 케이스가 다수 리포트 되고 있습니다.

[How can I grant permission to API Gateway to invoke lambda functions through CloudFormation?](https://intellipaat.com/community/16577/how-can-i-grant-permission-to-api-gateway-to-invoke-lambda-functions-through-cloudformation)

[AWS API Gateway Invoke Lambda Function Permission](
https://intellipaat.com/community/16577/how-can-i-grant-permission-to-api-gateway-to-invoke-lambda-functions-through-cloudformation)

[I defined my Lambda integration in API Gateway using a stage variable. Why do I get an "Internal server error" and a 500 status code when I invoke the API method?](https://intellipaat.com/community/16577/how-can-i-grant-permission-to-api-gateway-to-invoke-lambda-functions-through-cloudformation)

현재 git을 포팅시 동일한 이슈가 있는데, 아래처럼 처리하면 됩니다. 

1) API Gateway Console에서 [Integration request[를 선택합니다. 

<img width="1405" alt="image" src="https://user-images.githubusercontent.com/52392004/159109404-f5d3418c-dc73-40a2-93d5-2133307d8dc3.png">

2) Lamda function에서 오른쪽 끝의 수정 버튼을 클릭합니다. 

![noname](https://user-images.githubusercontent.com/52392004/159109490-c5ebc580-1eee-4ad7-9f1b-06448c5b70b7.png)

3) 이후 수정없이 체크 버튼을 클릭 합니다. 

![noname](https://user-images.githubusercontent.com/52392004/159109512-094fa66a-66d6-4f5f-b396-ca1134ff7f4d.png)

4) 아래처럼 invite를 확인하는 팝업이 뜨면 OK를 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/159109549-21ce467b-f259-4f1a-8166-625fcd43f399.png)

같은 방식으로 다른 method도 동일하게 lambda랑 연결합니다. 
