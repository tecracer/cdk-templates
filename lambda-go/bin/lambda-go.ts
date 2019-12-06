#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { LambdaGoStack } from '../lib/lambda-go-stack';

const app = new cdk.App();
new LambdaGoStack(app, 'LambdaGoStack');
