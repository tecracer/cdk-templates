import { Stack, Construct, StackProps, Tag, CfnOutput } from '@aws-cdk/core';
import { Instance, AmazonLinuxImage, AmazonLinuxGeneration, AmazonLinuxEdition, AmazonLinuxVirt, AmazonLinuxStorage, InstanceType, InstanceClass, InstanceSize, Vpc, SubnetType, SecurityGroup, Peer, Port } from '@aws-cdk/aws-ec2';
import { ManagedPolicy, Role, ServicePrincipal, CfnInstanceProfile } from '@aws-cdk/aws-iam'
import { GetLocalIp } from './getip'

export class VpcStack extends Stack {
  public vpc: Vpc;
  public securitygroup: SecurityGroup;
  constructor(scope: Construct, id: string, props?:StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = new Vpc(this, 'DemoVPC');

    this.vpc = vpc;
    
    const sg = new SecurityGroup(this, "DynamicSSHSG", {
      vpc,
      securityGroupName: "SSH incoming",
      description: "SSH Incoming on current public ip",
      allowAllOutbound: true,
    });
    
    const clientIp = GetLocalIp();
  
    clientIp.then((ip) => {
      
      Tag.add(sg, "Name", "dynamicIncomingSSHClient");
      
      sg.addIngressRule(Peer.ipv4(ip), Port.tcp(22), "Ssh Client incoming")
      
      const sshIncomingSecurityGroupOutput = new CfnOutput(this, 'dynamicIncomingSSHClientOutput', {
        description: "dynamicIncomingSSHClient",
        value: sg.securityGroupId,
        exportName: 'dynamicIncomingSSHClient',
      })
      
      
    });

    this.securitygroup = sg;
    
    new CfnOutput(this, "DemoVpcId", {
      description: "Instance id VPC Demo",
      value: vpc.vpcId
    });
    
    new CfnOutput(this, "DemoPublicSubnet", {
      description: "DemoPublicSubnet",
      value: vpc.publicSubnets[0].subnetId
    });

  }
}
