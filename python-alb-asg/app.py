#!/usr/bin/env python3

from aws_cdk import core

from python_alb_asg.python_alb_asg_stack import PythonAlbAsgStack


app = core.App()
PythonAlbAsgStack(app, "python-alb-asg")

app.synth()
