# cdk-templates

AWS CDK is th "Cloud Development Kit" which lets you programm CloudFormation Templates.

This is a collection of templates for the cdk

## alb-update

Simple application load balancer with "hello world" webserver on instance.

Example for:

- Auto generate AMI for region and OS type
- Attach AWS managed policy to role
- EC2 Userdata in external file
- Attach Role for SSM Session Manager to instance in ASG

## lambda-simple

Example for:

- lambda with local code (asset)
- Programming resources *and* Lambda in the same programming language.

## OpsCenter Role

Role for AWS OpsCenter

Examples for:

- Create IAM Role with own policy statements

## vpc-bastion

VPC with a bastion host, which is managed by SSM

Examples for:

- Instance ProfileRole
- Searching EC2 image types
