import { Stack, StackProps } from 'aws-cdk-lib';
import { AutoScalingGroup } from 'aws-cdk-lib/lib/aws-autoscaling';
import { AmazonLinuxGeneration, AmazonLinuxImage, InstanceClass, InstanceSize, InstanceType, Vpc } from 'aws-cdk-lib/lib/aws-ec2';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/lib/aws-elasticloadbalancingv2';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/lib/aws-iam';
import { SmsSubscription } from 'aws-cdk-lib/lib/aws-sns-subscriptions';
import { StringParameter } from 'aws-cdk-lib/lib/aws-ssm';
import { Construct } from 'constructs';
import fs = require('fs');


export class AlbEc2Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const albVpc = new Vpc(this, 'VPC');
  

    const instanceRole = new Role(this,'webinstancerole',
    {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2RoleforSSM')],
      
    });

    const asg = new AutoScalingGroup(this, 'ASG', {
      vpc: albVpc,
      instanceType: InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.MICRO),
      machineImage: new AmazonLinuxImage({generation: AmazonLinuxGeneration.AMAZON_LINUX_2}),
      role: instanceRole,
    });

    var bootscript:string;
    bootscript = fs.readFileSync('userdata/webserver.sh','utf8');
      
    asg.addUserData(bootscript);

    const lb = new ApplicationLoadBalancer(this, 'LB', {
      vpc: albVpc,
      internetFacing: true
    });

    const listener = lb.addListener('Listener', {
      port: 80,
    });

    listener.addTargets('Target', {
      port: 80,
      targets: [asg]
    });

    listener.connections.allowDefaultPortFromAnyIpv4('Open to the world');

    asg.scaleOnRequestCount('AModestLoad', {
      targetRequestsPerMinute: 1,
    });

    new StringParameter(this, "alb_ec2", {
      stringValue: lb.loadBalancerDnsName,
      parameterName: "/cdk-templates/alb_ec2",
      description: "URL to test"
    })
  }
}
