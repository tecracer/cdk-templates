import lambda = require('@aws-cdk/aws-lambda');
import path = require('path');
import cdk = require('@aws-cdk/cdk');


export class CdkLambdaSimpleStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);
    
    // The code that defines your stack goes here
    new lambda.Function(this, 'HelloHandler', {
      code: lambda.Code.asset(path.join(__dirname,  '../lambda')),
      handler: 'hello.handler',
      runtime: lambda.Runtime.NodeJS810,
      memorySize: 1024
    });
  }
}

