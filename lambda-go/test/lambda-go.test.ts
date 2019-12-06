import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import LambdaGo = require('../lib/lambda-go-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new LambdaGo.LambdaGoStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});