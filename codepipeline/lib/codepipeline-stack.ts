import cdk = require('@aws-cdk/cdk');
import { Pipeline } from '@aws-cdk/aws-codepipeline';

export class CodepipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const pipeline = new Pipeline(this, 'Pipeline', {});

  }
}
