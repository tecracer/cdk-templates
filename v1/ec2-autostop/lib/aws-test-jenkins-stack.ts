import cdk = require('@aws-cdk/core');
import {CfnInstance, Vpc, SecurityGroup, Peer, Port, InstanceType}  from '@aws-cdk/aws-ec2';
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import fs = require('fs')


export class AwsTestJenkinsStack extends cdk.Stack {
  instance: CfnInstance;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let clientIps = "10.0.0.0/16"
    //let key = "mykey";

    const jenkinsVPC = new Vpc(this, 'TheVPC',{
      maxAzs: 2,
    });  

    const jenkinsSG = new SecurityGroup(this, "WebServerSG",{
      vpc: jenkinsVPC,
      securityGroupName: "jenkinsServer",
      description:  "WebServerSG",
      allowAllOutbound: true,
    });
    
    //tags: [{key: "Name", value: "WebServerSG"}],


    jenkinsSG.addIngressRule(Peer.ipv4(clientIps), Port.tcp(22), "Ssh incoming")
    jenkinsSG.addIngressRule(Peer.ipv4(clientIps), Port.tcp(80), "http incoming")
    jenkinsSG.addIngressRule(Peer.ipv4(clientIps), Port.tcp(8080), "jenkins incoming")
    jenkinsSG.addIngressRule(Peer.ipv4(jenkinsVPC.vpcCidrBlock), Port.tcp(8080), "jenkins incoming")
   
    new cdk.CfnOutput(this, 'JenkinsServerSG', { value: jenkinsSG.securityGroupId });
   
    // Server Bootstrap
    var bootscript:string;
    bootscript = Buffer.from( fs.readFileSync('userdata/jenkins.sh','utf8')).toString('base64');
      

    const codeCommitPluginPolicyDocument = new iam.PolicyDocument({
      assignSids: true,
      statements: [new iam.PolicyStatement({
                    actions: ['sqs:ReceiveMessage', 
                    'sqs:DeleteMessage', 
                    'sqs:ListQueues',
                    'sqs:DeleteMessageBatch',
                    'sqs:GetQueueAttributes',
                    'sqs:ListQueues'],
                    effect: iam.Effect.ALLOW,
                    resources: ['*'],
                  }),
                ], 
    });

    const instanceRole = new iam.Role(this,'jenkinsinstancerole',
    {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2RoleforSSM'),],
      inlinePolicies: {"CodeBuildJenkinsPlugin": codeCommitPluginPolicyDocument},

    });
    const bastionInstanceProfile = new iam.CfnInstanceProfile( this,'JenkinsServerProfile',{
        roles: [instanceRole.roleName]
    })
    const linuxImageId = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      edition: ec2.AmazonLinuxEdition.STANDARD,
      virtualization: ec2.AmazonLinuxVirt.HVM,
      storage: ec2.AmazonLinuxStorage.GENERAL_PURPOSE,
    }).getImage(this).imageId;

    const instanceTypeString = ec2.InstanceType.of(ec2.InstanceClass.COMPUTE5, ec2.InstanceSize.LARGE).toString();

   const jenkinsServerInstance = new CfnInstance(this, 'JenkinsServer', {
      imageId: linuxImageId,
      //keyName: key,
      instanceType: instanceTypeString,
      iamInstanceProfile: bastionInstanceProfile.instanceProfileName,
      securityGroupIds: [jenkinsSG.securityGroupId],
      subnetId: jenkinsVPC.publicSubnets[0].subnetId,
      tags: [{key: "Name", value: "JenkinsServer"}],
      userData: bootscript,

    })
    this.instance = jenkinsServerInstance;
    new cdk.CfnOutput(this,'jenkins',{
      description: "jenkins internal ip",
      value: jenkinsServerInstance.attrPrivateIp,
    })

    
  }
}
