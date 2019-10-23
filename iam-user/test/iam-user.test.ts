import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import IamUser = require('../lib/iam-user-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new IamUser.IamUserStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});