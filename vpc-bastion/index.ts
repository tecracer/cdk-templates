#!/usr/bin/env node
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');

class VPCBastionStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);
    new ec2.Vpc(this, 'TheVPC',{
      maxAZs: 2,
    });  

    const instanceRole = new iam.Role(this,'ssminstancerole',
    {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicyArns: ['arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM'],
    });
    const bastionInstanceProfile = new iam.CfnInstanceProfile( this,'BastionProfile',{
        roles: [instanceRole.roleName]
    })
    const linuxImageId = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AmazonLinux,
      edition: ec2.AmazonLinuxEdition.Standeard,
      virtualization: ec2.AmazonLinuxVirt.HVM,
      storage: ec2.AmazonLinuxStorage.GeneralPurpose,
    }).getImage(this).imageId;
   new ec2.CfnInstance(this, "Bastion",{
      imageId: linuxImageId,
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Micro).toString(),      
      iamInstanceProfile: bastionInstanceProfile.instanceProfileName,
      tags: [{key: "Name", value: "Web"}],
    })
  }
}

const app = new cdk.App();
new VPCBastionStack(app, 'VPCBastionStack');
app.run();
