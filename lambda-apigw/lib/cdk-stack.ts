

// import apigateway = require("@aws-cdk/aws-apigateway");
import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import path = require('path');
import {LambdaRestApi} from  '@aws-cdk/aws-apigateway';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    // The code that defines your stack goes here
    const fn = new lambda.Function(this, 'HelloHandler', {
      code: lambda.Code.asset(path.join(__dirname,  '../lambda')),
      handler: 'hello.handler',
      runtime: lambda.Runtime.NODEJS_8_10,
      memorySize: 1024
    });

    new LambdaRestApi(this, 'HelloAPI', {
      handler: fn,
    });

  }
}
