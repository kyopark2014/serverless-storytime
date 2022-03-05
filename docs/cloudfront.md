# 5. CloudFront 구현

 
CloudFront는 AWS의 CDN 서비스로 Simple File Sharing에서 업로드한 파일을 외부에 공유하기 위해 사용하고자 합니다.

1) CloudFront console의 [Distribution]에 접속하여 [Create distributions]를 선택 합니다. 

https://console.aws.amazon.com/cloudfront/v3/home?region=ap-northeast-2#/distributions


![cloudfront-1](https://user-images.githubusercontent.com/52392004/156367906-dfb29a80-8285-4da6-9951-83d467de75a9.png)

2) [Create distribution]에서 [Origin domain]을 선택하면 기존에 생성한 S3 bucket과 유사한 도메인 들이 보여집니다. 여기서 "s3-simple-storytime"와 관련된 도메인을 선택합니다. 또한, 보안을 위해 아래와 같이 [S3 bucket access]를 “Don't use OAI (bucket must allow public access)”에서 “Yes use OAI (bucket can restrict access to only CloudFront)”로 변경하고, [Bucket policy]를 "Yes, update the bucket policy"를 선택합니다. 

![cloudfront-2](https://user-images.githubusercontent.com/52392004/156368116-dff7ff0b-677c-42a7-b5a4-3f3b13394658.png)

[Create new OAI]를 선택하여 "Origin access identity"를 아래처럼 생성합니다. 

![cloudfront-2b](https://user-images.githubusercontent.com/52392004/156368167-54b6d351-b397-44bc-9fb2-539f010912ec.png)

3) 아래로 스크롤하여 [Viewer]에서 보안을 위하여 “HTTP and HTTPS” 에서 “Redirect HTTP to HTTP”을 선택합니다. 

![cloudfront-3](https://user-images.githubusercontent.com/52392004/156368216-3a31a525-f199-4b33-a4fd-4d2ddbcb45fd.png)

4) 나머지 설정은 default로 유지하고 [Create distribution]을 선택하여 Distribution을 등록합니다. 이때 생성을 위해 수분에서 수십분 시간이 소요되는데 아래와 같이 Status에서 “Enabled"가 되어야 사용할 수 있습니다. 또한, 아래와 같이 접속할 도메인의 주소를 “https://d2a58i4civia46.cloudfront.net” 와 같이 확인 할 수 있습니다. 

![cloudfront-4](https://user-images.githubusercontent.com/52392004/156368285-f6f9ecac-cb83-43f7-a985-ca8e1011a03c.png)
