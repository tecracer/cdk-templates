# CDK GO examples

Integration test for new CDK releases:

1) Set release in `Taskfile.yml`

```yaml
vars:
  version: v2.0.0-rc.7
  constructs: v10.0.5
```

2) Call `script/integration_test.sh``



## alb_ec2

- EC2 Webserver
- Application Load Balancer
- dev and production stage
- test with url: `http_helper.HttpGetWithRetry`

## custom_resource_ses

- calling a Lambda aka custom resource to make an api call for not supported constructs
See [Blog Bridging the terraform - CloudFormation gap ](https://aws-blog.de/2020/06/bridging-the-terraform-cloudformation-gap.html)

## iam_user

- IAM User as loop
- encrypted password from secrets manager
- Integration Test with cit/getUser

## Lambda go

- Lambda function also in go
- Unit Test if Lambda resource is included in generated CloudFormation
- Integration test with citlambda.GetFunctionConfiguration
- Application test, invoking the lambda


## Lambda simple

- JS lambda as code asset 
- Go working path
- Unit Test if Lambda resource is included in generated CloudFormation
- Integration test with citlambda.GetFunctionConfiguration

## vpc 

- Simple vpc
- Test for existing resource with terratest via exported parameter
- Integration test with citec2.GetVpc


## State: Test for cdk v2.0.0-rc.7


```bash
 ./script/integration_test.sh
off
Testing all GO Templates
Testing test-alb_ec2
Mi  9 Jun 2021 23:03:40 CEST
✅ test-alb_ec2 OK
##############################
Testing test-iam-user
Mi  9 Jun 2021 23:11:23 CEST
✅ test-iam-user OK
##############################
Testing test-lambda-simple
Mi  9 Jun 2021 23:13:42 CEST
✅ test-lambda-simple OK
##############################
Testing test-vpc
Mi  9 Jun 2021 23:16:14 CEST
✅ test-vpc OK
##############################
```
