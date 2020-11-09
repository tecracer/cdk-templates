import { Stack, Construct, StackProps, CfnOutput } from '@aws-cdk/core';
import {Function, Code, Runtime} from '@aws-cdk/aws-lambda'
import path = require('path');


export class LambdaGoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const goFunction = new Function(this, "LambdaGo",
    {
      code: Code.fromAsset(path.join(__dirname,  '../lambda/dist/main.zip'),{
        
      }),
      handler: 'main',
      runtime: Runtime.GO_1_X,
      memorySize: 1024,
    })

    new CfnOutput(this,"LambdaGoOutput",{
      value: goFunction.functionName,
      description: "Name of Lambda"
    })

  }
}
