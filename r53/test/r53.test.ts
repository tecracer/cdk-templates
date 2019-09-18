import { expect as expectCDK, matchTemplate, MatchStyle, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import R53 = require('../lib/r53-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new R53.R53Stack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(haveResource('AWS::Route53::HostedZone',
     {
          "Name": "mydomain.de.",
    }));
});