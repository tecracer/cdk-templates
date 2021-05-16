#!/usr/bin/env python3

import os
from aws_cdk import core

from python_alb_asg.python_alb_asg_stack import PythonAlbAsgStack


app = core.App()

# for production set your Environment to specify the target region and account
# Prod_Env__Ire = env=core.Environment(region="eu-west-1",account="<YOUR_ACCOUNT-ID>")

PythonAlbAsgStack(app, "ALBLayer", env=core.Environment(
    account=os.environ["CDK_DEFAULT_ACCOUNT"], 
    region=os.environ["CDK_DEFAULT_REGION"]))

app.synth()
