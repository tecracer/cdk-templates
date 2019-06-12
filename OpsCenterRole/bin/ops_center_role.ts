#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { OpsCenterRoleStack } from '../lib/ops_center_role-stack';

const app = new cdk.App();
new OpsCenterRoleStack(app, 'OpsCenterRoleStack');
