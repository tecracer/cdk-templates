#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkTransitgatewayStack } from '../lib/cdk-transitgateway-stack';
import {VPCSetting} from '../lib/vpc-setting'

const app = new cdk.App();
const myTgw = new CdkTransitgatewayStack(app, 'CdkTransitgatewayStack');
new VPCSetting(app, "VPCs",myTgw);
