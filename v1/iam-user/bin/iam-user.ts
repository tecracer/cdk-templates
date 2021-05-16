#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { IamUserStack } from '../lib/iam-user-stack';
import { SecretsStack} from '../lib/secrets-stack';

const app = new cdk.App();
new SecretsStack(app, 'SecretsStack');
new IamUserStack(app, 'IamUserStack');
