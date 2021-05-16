import * as cdk from 'aws-cdk-lib';
import * as CustomResourceSes from '../lib/custom-resource-ses-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CustomResourceSes.CustomResourceSesStack(app, 'MyTestStack');
    // THEN
    const actual = app.synth().getStackArtifact(stack.artifactId).template;
    expect(actual.Resources ?? {}).toEqual({});
});
