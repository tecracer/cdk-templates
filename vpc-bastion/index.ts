#!/usr/bin/env node
import ec2 = require('@aws-cdk/aws-ec2');
import {InstanceClass,InstanceSize,InstanceType} from '@aws-cdk/aws-ec2';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');

class VPCBastionStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);
    new ec2.Vpc(this, 'TheVPC',{
      maxAzs: 2,
    });  

    const instanceRole = new iam.Role(this,'ssminstancerole',
    {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2RoleforSSM')],
    });
    const bastionInstanceProfile = new iam.CfnInstanceProfile( this,'BastionProfile',{
        roles: [instanceRole.roleName]
    })
    const linuxImageId = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX,
      edition: ec2.AmazonLinuxEdition.STANDARD,
      virtualization: ec2.AmazonLinuxVirt.HVM,
      storage: ec2.AmazonLinuxStorage.GENERAL_PURPOSE,
    }).getImage(this).imageId;
   new ec2.CfnInstance(this, "Bastion",{
      imageId: linuxImageId,
      instanceType: InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.MICRO).toString(),
      iamInstanceProfile: bastionInstanceProfile.ref,
      tags: [{key: "Name", value: "Web"}],
    })
  }
}

const app = new cdk.App();
new VPCBastionStack(app, 'VPCBastionStack');
