#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SelfEditingStack } from '../lib/self_editing-stack';

const app = new cdk.App();
new SelfEditingStack(app, 'SelfEditingStack',  {
    MFAManagementAllowed: true,
    accessKeyManagementAllowed: true,
    passwordEditingAllowed: true,
    sshKeyManagementAllowed: true,
});
