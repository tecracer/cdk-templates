#!/usr/bin/env python3

from aws_cdk import core

from alb_py.alb_py_stack import AlbPyStack


app = core.App()

Env_Fra = env=core.Environment(region="eu-central-1",account="738155121896")
Env__Ire = env=core.Environment(region="eu-west-1",account="738155121896")

#AlbPyStack(app, "ALBLayer", env=core.Environment(region="eu-central-1",account="738155121896"))
AlbPyStack(app, "ALBLayer", env=Env_Fra)

app.synth()
