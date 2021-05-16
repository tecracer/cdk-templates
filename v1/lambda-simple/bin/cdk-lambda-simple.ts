#!/usr/bin/env node
//import 'source-map-support/register';
import cdk = require('@aws-cdk/core');

import { CdkLambdaSimpleStack } from '../lib/cdk-lambda-simple-stack';

const app = new cdk.App();
new CdkLambdaSimpleStack(app, 'CdkLambdaSimpleStack');
