# cdk-templates

AWS CDK is th "Cloud Development Kit" which lets you programm CloudFormation Templates.

This is a collection of templates for the cdk

## alb-update

cdk version 0.37

Simple application load balancer with "hello world" webserver on instance.

### alb-update has examples for

- Auto generate AMI for region and OS type
- Attach AWS managed policy to role
- EC2 Userdata in external file
- Attach Role for SSM Session Manager to instance in ASG

### Usage

- `cdk deploy`
- Open LoadBalancer DNS in browser

## lambda-simple

### lambda-simple has examples for

- lambda with local code (asset)
- Programming resources *and* Lambda in the same programming language.

## OpsCenter Role

Role for AWS OpsCenter

### OpsCenterRole has example for

- Create IAM Role with own policy statements

## vpc-bastion

VPC with a bastion host, which is managed by SSM

### vpc-bastion has examples for

- Instance ProfileRole
- Searching EC2 image types
