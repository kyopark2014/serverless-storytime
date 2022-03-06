# 5. CloudFront 구현

 
CloudFront는 AWS의 CDN 서비스로 Simple File Sharing에서 업로드한 파일을 외부에 공유하기 위해 사용하고자 합니다.

1) CloudFront console의 [Distribution]에 접속하여 [Create distributions]를 선택 합니다. 

https://console.aws.amazon.com/cloudfront/v3/home?region=ap-northeast-2#/distributions


![cloudfront-1](https://user-images.githubusercontent.com/52392004/156367906-dfb29a80-8285-4da6-9951-83d467de75a9.png)

2) [Create distribution]에서 [Origin domain]을 선택하면 기존에 생성한 S3 bucket과 유사한 도메인 들이 보여집니다. 여기서 "s3-storytime"와 관련된 도메인을 선택합니다. 또한, 보안을 위해 아래와 같이 [S3 bucket access]를 “Don't use OAI (bucket must allow public access)”에서 “Yes use OAI (bucket can restrict access to only CloudFront)”로 변경하고, [Bucket policy]를 "Yes, update the bucket policy"를 선택합니다. 

![image](https://user-images.githubusercontent.com/52392004/156879328-f208bf00-ee49-4437-96a4-597cd38903f3.png)


[Create new OAI]를 선택하여 "Origin access identity"를 아래처럼 생성합니다. 

![image](https://user-images.githubusercontent.com/52392004/156879272-70bf50e7-f95f-47dc-a244-8b4926da8d8d.png)



3) 아래로 스크롤하여 [Viewer]에서 보안을 위하여 “HTTP and HTTPS” 에서 “Redirect HTTP to HTTP”을 선택합니다. 

![cloudfront-3](https://user-images.githubusercontent.com/52392004/156368216-3a31a525-f199-4b33-a4fd-4d2ddbcb45fd.png)

4) 나머지 설정은 default로 유지하고 [Create distribution]을 선택하여 Distribution을 등록합니다. 이때 생성을 위해 수분에서 수십분 시간이 소요되는데 아래와 같이 Status에서 “Enabled"가 되어야 사용할 수 있습니다. 또한, 아래와 같이 접속할 도메인의 주소를 “https://d6lt9jm4dt4ei.cloudfront.net” 와 같이 확인 할 수 있습니다. 

![noname](https://user-images.githubusercontent.com/52392004/156879384-93977c37-1a5e-44c2-9634-a6010b5f4b12.png)
