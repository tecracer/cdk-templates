# Lambda - simple

> This code is build in dependence on Gernot's [cdk-template/lambda-simple](https://github.com/tecracer/cdk-templates/tree/master/lambda-simple). Ckeck it out if you prefer a similar implementation in Typescript. 

## Introduction

Intention of this CDK app is, to demonstrate how to define and deploy a very simple Serverless Application (one Lambda-Function) using Python. Source-code of the Python-Function will be uploaded from a local directory to an S3 Bucket before deployment.
For deployment you have two options, either through the *cdk cli* or using *task* with the provided Taskfile.yml.

## Architecture

This stack builds up:

- A Lambda Function
- A S3 Bucket to store the Lambda-Function Code\
( part of the *CDK bootstrap* process)

## Prerequisites

- Python >= 3.6 is installed
- CDK is installed --> ([Installing the AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html))
- awsume is installed --> ([awsume](https://github.com/trek10inc/awsume))
- **(optional)** tasks if you want to deploy with task --> [tasks](https://taskfile.dev/#/)

## Steps to deploy with ...

### CDK CLI
1. Clone or checkout repo/branch (git clone / git checkout)
1. Navigate to this directory (\<yourDir\>/cdk-templates/python-alb-asg)
1. Create a new python virtual environment, e.g. `python3 -m venv .env`
1. Activate the environment using `source .env/bin/activate` on Mac or Linux or run `source.bat` on Windows.
1. Install dependencies: `pip install -r requirements.txt`
1. Set your AWS profile and region through `awsume <profile_name> --region <region-code>`.\
Omit *"--region"* to use the *region-code* configured for your *"\<profile_name\>"*.\
**Optional:** Set your Environment as described here: [CDK Environment](https://docs.aws.amazon.com/cdk/latest/guide/environments.html)
1. Run `cdk synth` to check if the CDK works as expected, you can inspect the template if you're curious.
1. Run `cdk bootstrap` **IF** deploying your first AWS CDK app containing a lambda function in this region; read more on the **bootstrap** section of the [AWS CDK Tools](https://docs.aws.amazon.com/cdk/latest/guide/tools.html).
1. Run `cdk deploy` to deploy the resources. 

### task
1. Clone or checkout repo/branch (git clone / git checkout)
1. Navigate to this directory (\<yourDir\>/cdk-templates/python-alb-asg)
1. Set your AWS profile and region through `awsume <profile_name> --region <region-code>`.\
Omit *"--region"* to use the *region-code* configured for your *"\<profile_name\>"*.\
**Optional:** Set your Environment as described here: [CDK Environment](https://docs.aws.amazon.com/cdk/latest/guide/environments.html)
1. Run `task synth` to check if the CDK works as expected, you can inspect the template if you're curious.
1. Run `task bootstrap` **IF** deploying your first AWS CDK app containing a lambda function in this region; read more on the **bootstrap** section of the [AWS CDK Tools](https://docs.aws.amazon.com/cdk/latest/guide/tools.html).
1. Run `task deploy` to deploy the resources.
1. **(Optional)** Run `task update` to update aws-cdk.core

## Useful commands for ... 
### CDK

 * `cdk ls`          list all stacks in the app
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk docs`        open CDK documentation

### task
Using the command `task -l`will list all available tasks with a short description for this project.

`task -l`:\
task: Available tasks for this project:
* `bootstrap`:    bootstrap the CDK environment if it is not already available
* `build`:        activate virtual environment, install required python modules
* `deploy`:       deploy stack without asking
* `destroy`:      destroy stack without asking
* `required`:     check required pre-requisites
* `synth`:        build cf template without deploying
