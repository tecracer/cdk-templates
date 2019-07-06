#!/usr/bin/env node
import autoscaling = require('@aws-cdk/aws-autoscaling');
import {AmazonLinuxImage,InstanceClass,InstanceSize,InstanceType} from '@aws-cdk/aws-ec2';
import { ManagedPolicy,Role,ServicePrincipal} from '@aws-cdk/aws-iam';
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/core');
import { AmazonLinuxGeneration , Vpc} from '@aws-cdk/aws-ec2';

import fs = require('fs');

class LoadBalancerStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const albVpc = new Vpc(this, 'VPC');
  

    const instanceRole = new Role(this,'webinstancerole',
    {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2RoleforSSM')],
      
    });

    const asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
      vpc: albVpc,
      instanceType: InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.MICRO),
      machineImage: new AmazonLinuxImage({generation: AmazonLinuxGeneration.AMAZON_LINUX_2}),
      role: instanceRole,
    });

    var bootscript:string;
    bootscript = fs.readFileSync('userdata/webserver.sh','utf8');
      
    asg.addUserData(bootscript);

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
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
      targetRequestsPerSecond: 1
    });
  }
}

const app = new cdk.App();
new LoadBalancerStack(app, 'LoadBalancerStack');
