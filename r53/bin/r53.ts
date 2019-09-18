#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { R53Stack } from '../lib/r53-stack';

const app = new cdk.App();
new R53Stack(app, 'R53Stack');
