import * as cdk from 'aws-cdk-lib';
import * as OpscenterRole from '../lib/opscenter_role-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new OpscenterRole.OpscenterRoleStack(app, 'MyTestStack');
    // THEN
    const actual = app.synth().getStackArtifact(stack.artifactId).template;
    expect(actual.Resources ?? {}).toEqual({});
});
