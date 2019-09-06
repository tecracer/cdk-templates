#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { AwsTestJenkinsStack } from '../lib/aws-test-jenkins-stack';
import { StopInstance } from '../lib/stop-instance';

const app = new cdk.App();
const jenkins = new AwsTestJenkinsStack(app, 'AwsTestJenkinsStack');
new StopInstance(app,'StopInstanceRule',jenkins);
app.synth();