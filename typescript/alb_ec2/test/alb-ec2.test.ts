import * as cdk from 'aws-cdk-lib';
import * as AlbEc2 from '../lib/alb-ec2-stack';

test('Load Balancer exists', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new AlbEc2.AlbEc2Stack(app, 'MyTestStack');
    // THEN
    const actual = app.synth().getStackArtifact(stack.artifactId).template;
    expect(actual.Resources.LB8A12904C.Type).toEqual("AWS::ElasticLoadBalancingV2::LoadBalancer")
});
