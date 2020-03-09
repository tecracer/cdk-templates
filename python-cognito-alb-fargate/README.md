
# Cognito - ALB - Fargate

> This is code has an accompanying [blog article](https://aws-blog.de/2020/03/building-a-fargate-based-container-app-with-cognito-authentication.html) which I highly recommend you check out before deploying it.

## Introduction

This CDK app sets up infrastructure that can be used to demonstrate the integration of Amazon Cognito with the Application Load Balancer. Furthermore it includes not only the log in but also the log out workflow.

## Architecture

![Architecture](architecture.png)

This stack builds up a bunch of things:

- A Cognito User Pool
- A DNS-Record for the application
- A SSL/TLS certificate
- An Application Load Balancer with that DNS recorcd and certificate
- An ECR Container Registry to push our Docker image to
- An ECS Fargate Service to run our demo application

## Prerequisites

- CDK is installed
- Docker is installed
- You have a public hosted zone in your account

## Steps to deploy

1. Check out the repo
2. Navigate to this directory
3. Create a new python virtual environment, e.g. `python3 -m venv .env`
4. Activate the environment using `source .env/bin/activate` on Mac or Linux or run `source.bat` on Windows.
5. Open `cognito_fargate_demo/cognito_fargate_demo_stack.py` and edit these variables as described in the [blog article](https://aws-blog.de/2020/03/building-a-fargate-based-container-app-with-cognito-authentication.html):

    ```python
    APP_DNS_NAME = "cognito-fargate-demo.mb-trc.de"
    COGNITO_CUSTOM_DOMAIN = "alb-fargate-auth-demo-mbtrc"
    HOSTED_ZONE_ID = "ZECQVEY17GSI4"
    HOSTED_ZONE_NAME = "mb-trc.de"
    ```

6. Run `cdk synth` to check if the CDK works as expected, you can inspect the template if you're curious.
7. Run `cdk deploy` to deploy the resources. 