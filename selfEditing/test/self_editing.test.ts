import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import SelfEditing = require('../lib/self_editing-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new SelfEditing.SelfEditingStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
