# cdk-templates

AWS CDK is th "Cloud Development Kit" which lets you programm CloudFormation Templates.

This is a collection of templates for the cdk

## Tooling

We use [tasks](https://taskfile.dev/#/) for scripting. 

For switching profiles [awsume](https://github.com/trek10inc/awsume) is used.

### Deploy Templates

If you use `awsume`, then the env variable `AWSUME_PROFILE` is set. If you work with different accounts its better to call the cdk cli with profile parameter.

So with awsume:

`task deploy`

Or with cdk directly:

`cdk deploy`

## Templates

## alb-update

Simple application load balancer with "hello world" webserver on instance. It spins up its own vpc for that.

### alb-update has examples for

- Auto generate AMI for region and OS type
- Attach AWS managed policy to role
- EC2 Userdata in external file
- Attach Role for SSM Session Manager to instance in ASG

### Usage of alb-update

- `cdk deploy`
- Open LoadBalancer DNS in browser

## lambda-apigw

Lambda with an api Gateway

## lambda-schedule

Simple lambda with CloudWatch event rule for daily triggering.

## lambda-simple

Simple Lambda which takes all files from local lambda directory. It create the lambda ressource and uploads the code.

### lambda-simple has examples for

- lambda with local code (asset)
- Programming resources *and* Lambda in the same programming language.


## OpsCenter Role

Role for AWS OpsCenter

### OpsCenterRole has example for

- Create IAM Role with own policy statements

### Usage of OpsCenterRole

Use role in any context.

## vpc-bastion


VPC with a bastion host, which is managed by SSM.
So no security groups.

### vpc-bastion has examples for

- Instance ProfileRole
- Searching EC2 image types

### Usage of vpc-bastion

Connect to bastion host with Systems Manager session manager, or new mssh.
