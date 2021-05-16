#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { SingleInstanceStack } from '../lib/single-instance-stack';
import { VpcStack} from '../lib/vpc-stack';

const app = new cdk.App();

const vpcstack = new VpcStack(app, "VpcStack");

new SingleInstanceStack(app, 'SingleInstanceStack',  vpcstack);
