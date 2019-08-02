

// import apigateway = require("@aws-cdk/aws-apigateway");
import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import path = require('path');
import {Rule,Schedule} from '@aws-cdk/aws-events';
import {LambdaFunction,SnsTopic} from '@aws-cdk/aws-events-targets';
import sns = require ('@aws-cdk/aws-sns');

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

    const rule = new Rule(this, 'Rule', {
      schedule: Schedule.expression('cron(0 12 * * ? *)')
    });

    rule.addTarget(new LambdaFunction(fn));

    const topic = new sns.Topic(this, "blogtopic");

    rule.addTarget( new SnsTopic(topic));


  }
}
