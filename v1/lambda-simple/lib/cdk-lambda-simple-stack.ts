import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');
import path = require('path');
import { CfnOutput } from '@aws-cdk/core';

export class CdkLambdaSimpleStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    // The code that defines your stack goes here
    const hello = new lambda.Function(this, 'HelloHandler', {
      code: lambda.Code.asset(path.join(__dirname, '../lambda')),
      handler: 'hello.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      memorySize: 1024
    });
    new CfnOutput(this, "HelloLambda", {
      value: hello.functionName
    }
    )
  }
}

