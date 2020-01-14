import { Stack, Construct, StackProps, Tag, CfnOutput } from '@aws-cdk/core';
import { Instance, AmazonLinuxImage, AmazonLinuxGeneration, AmazonLinuxEdition, AmazonLinuxVirt, AmazonLinuxStorage, InstanceType, InstanceClass, InstanceSize, OperatingSystemType,Vpc, SubnetType, SecurityGroup, UserData, Peer, Port, GenericLinuxImage } from '@aws-cdk/aws-ec2';
import { ManagedPolicy, Role, ServicePrincipal, CfnInstanceProfile } from '@aws-cdk/aws-iam'
import { VpcStack} from './Vpc-stack'

export class SingleInstanceStack extends Stack {
  constructor(scope: Construct, id: string, vpc: VpcStack, props?:StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
  
    // const linuxImage = new AmazonLinuxImage({
    //   generation: AmazonLinuxGeneration.AMAZON_LINUX_2
    // });
    //{"ubuntu-xenial-16.04-amd64-server-20191114", OperatingSystemType.LINUX}
    // const myUserData = UserData.forLinux();
    // myUserData.addCommands("yum update -y");

    // const linuxImage = new GenericLinuxImage({"eu-central-1" : "ubuntu-xenial-16.04-amd64-server-20191114"},
    // {
    //   userData: myUserData
    // });

    const bucketname = process.env.DEPLOYMENTBUCKET;
    const eicPackage = 'ec2-instance-connect-1.1-13.noarch.rpm'
    const keyName = process.env.KEYNAME;

    const linuxImage = new AmazonLinuxImage({
      generation: AmazonLinuxGeneration.AMAZON_LINUX_2
    });

    const instance=new Instance(this, "singleinstance", {
        vpc: vpc.vpc,
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MEDIUM),
        machineImage: linuxImage,
        vpcSubnets: {subnetType: SubnetType.PUBLIC},
        keyName:keyName
        },
      );

    instance.role.addManagedPolicy( ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'));
    instance.role.addManagedPolicy( ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2RoleforSSM'));
    instance.addUserData('yum update -y');
    instance.addUserData("aws s3 cp s3://"+bucketname+"/rpm/"+eicPackage+" /tmp/ec2-instance-connect.rpm");
    instance.addUserData("yum install /tmp/ec2-instance-connect.rpm -y")
    instance.addUserData("sudo systemctl daemon-reload")

    
    
    instance.addSecurityGroup(vpc.securitygroup);
    

    new CfnOutput(this, "DemoInstanceId", {
      description: "Instance id imdbv2 Demo",
      value: instance.instanceId,
      exportName: 'demoInstanceId'
    });

  }
}
