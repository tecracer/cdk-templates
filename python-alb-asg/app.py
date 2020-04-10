#!/usr/bin/env python3

from aws_cdk import core

from python_alb_asg.python_alb_asg_stack import PythonAlbAsgStack


app = core.App()

# Env__Ire = env=core.Environment(region="eu-west-1",account="<YOUR_ACCOUNT-ID>")

PythonAlbAsgStack(app, "ALBLayer", env=<YOUR-ENVIRONMENT>)

app.synth()
