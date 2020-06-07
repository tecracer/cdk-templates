#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsCustomResourceSesStack } from '../lib/aws-custom-resource-ses-stack';

const app = new cdk.App();
new AwsCustomResourceSesStack(app, 'AwsCustomResourceSesStack');
