#!/usr/bin/env python3

import os
from aws_cdk import core
from python_lambda_test.python_lambda_test_stack import PythonLambdaTestStack


app = core.App()

# for production set your Environment to specify the target region and account
# Prod_Env__Ire = env=core.Environment(region="eu-west-1",account="<YOUR_ACCOUNT-ID>")

PythonLambdaTestStack(app, "python-lambda-test", env=core.Environment(
    account=os.environ["CDK_DEFAULT_ACCOUNT"], 
    region=os.environ["CDK_DEFAULT_REGION"]))

app.synth()
