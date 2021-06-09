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

## iam_user

- IAM User as loop
- encrypted password from secrets manager
- Integration Test with cit/getUser

## Lambda simple

- JS lambda as code asset 
- Go working path
- Unit Test if Lambda resource is included in generated CloudFormation
- Integration test with citlambda.GetFunctionConfiguration

## vpc 

- Simple vpc
- Test for existing resource with terratest via exported parameter
- Integration test with citec2.GetVpc
