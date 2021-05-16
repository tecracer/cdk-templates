# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## Used tools

To run with a single cmd, please install:

- [task](https://taskfile.dev)
- [awsume](https://github.com/trek10inc/awsume)
- go

Suppose you want to use the profile "cdk":

1) `awsume cdk`
2) `task deploy`

You should see:

```bash
ask deploy
task: Task "build-go" is up to date
Profile cdk
cdk deploy --require-approval never --profile $AWSUME_PROFILE
LambdaGoStack: deploying...
Updated: asset.81bb840a01a5a6f45d57a824e4c02339fcef8797ffc70e360712c031cd29f999.zip (file)
LambdaGoStack: creating CloudFormation changeset...
 0/4 | 10:54:40 AM | CREATE_IN_PROGRESS   | AWS::CDK::Metadata    | CDKMetadata
 0/4 | 10:54:41 AM | CREATE_IN_PROGRESS   | AWS::IAM::Role        | circularMigration/ServiceRole (circularMigrationServiceRoleFEE53543)
 0/4 | 10:54:41 AM | CREATE_IN_PROGRESS   | AWS::IAM::Role        | circularMigration/ServiceRole (circularMigrationServiceRoleFEE53543) Resource creation Initiated
 0/4 | 10:54:42 AM | CREATE_IN_PROGRESS   | AWS::CDK::Metadata    | CDKMetadata Resource creation Initiated
 1/4 | 10:54:42 AM | CREATE_COMPLETE      | AWS::CDK::Metadata    | CDKMetadata
 2/4 | 10:54:55 AM | CREATE_COMPLETE      | AWS::IAM::Role        | circularMigration/ServiceRole (circularMigrationServiceRoleFEE53543)
 2/4 | 10:54:57 AM | CREATE_IN_PROGRESS   | AWS::Lambda::Function | circularMigration (circularMigration044BAF05)
 2/4 | 10:54:58 AM | CREATE_IN_PROGRESS   | AWS::Lambda::Function | circularMigration (circularMigration044BAF05) Resource creation Initiated
 3/4 | 10:54:58 AM | CREATE_COMPLETE      | AWS::Lambda::Function | circularMigration (circularMigration044BAF05)
 4/4 | 10:54:59 AM | CREATE_COMPLETE      | AWS::CloudFormation::Stack | LambdaGoStack

 ✅  LambdaGoStack

Stack ARN:
arn:aws:cloudformation:eu-central-1:123456789023:stack/LambdaGoStack/581d85c0-180e-11ea-b535-064aba521f98
```

## Test installation

### Find lambda in AWS Console

- Choose Lambda Service
- Find newest lambda 
    - Sort last modified
- Name is like `LambdaGoStack-circularMigration044BAF05-BOA9JYV1H984`

### Configure Test Event

- Choose Amazon S3 put

### Test

First run:

```txt
START RequestId: 7f78cbb7-bbe5-4d4c-9730-7e1cf346a250 Version: $LATEST
Bucket = example-bucket, Key = test/key 
END RequestId: 7f78cbb7-bbe5-4d4c-9730-7e1cf346a250
REPORT RequestId: 7f78cbb7-bbe5-4d4c-9730-7e1cf346a250	Duration: 0.84 ms	Billed Duration: 100 ms	Memory Size: 1024 MB	Max Memory Used: 42 MB	Init Duration: 68.11 ms	
```

Second run

```txt
START RequestId: 314f13bf-0066-420b-a54d-42be8d48827e Version: $LATEST
Bucket = example-bucket, Key = test/key 
END RequestId: 314f13bf-0066-420b-a54d-42be8d48827e
REPORT RequestId: 314f13bf-0066-420b-a54d-42be8d48827e	Duration: 0.72 ms	Billed Duration: 100 ms	Memory Size: 1024 MB	Max Memory Used: 42 MB
````
