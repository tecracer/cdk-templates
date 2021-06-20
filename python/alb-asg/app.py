#!/usr/bin/env python3
import os

import aws_cdk as cdk

from alb_asg.alb_asg_stack import AlbAsgStack


app = cdk.App()
AlbAsgStack(app, "AlbAsgStack",
    env=cdk.Environment(account=os.getenv('CDK_DEFAULT_ACCOUNT'), region=os.getenv('CDK_DEFAULT_REGION')),
    )

app.synth()
