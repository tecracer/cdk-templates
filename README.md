# cdk-templates

AWS CDK is th "Cloud Development Kit" which lets you programm CloudFormation Templates.

This is a collection of templates for the cdk

## lambda-simple

Example of how to use lambda with cdk.
Programming resources *and* Lambda in the same programming language.

## alb-update

Simple application load balancer with "hello world" webserver on instance.

Example for:

- Auto generate AMI for region and OS type
- Attach AWS managed policy to role
- EC2 Userdata in external file
- Attach Role for SSM Session Manager to instance in ASG