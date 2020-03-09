#!/usr/bin/env python3

from aws_cdk import core

from cognito_fargate_demo.cognito_fargate_demo_stack import CognitoFargateDemoStack


app = core.App()
CognitoFargateDemoStack(app, "cognito-fargate-demo", env={'region': 'eu-central-1'})

app.synth()
