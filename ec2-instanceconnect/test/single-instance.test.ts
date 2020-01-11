import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import SingleInstance = require('../lib/single-instance-stack');
import { VpcStack } from '../lib/Vpc-stack'

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const vpcstack = new VpcStack(app, "Testvpc");
    const stack = new SingleInstance.SingleInstanceStack(app, 'MyTestStack', vpcstack);
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});