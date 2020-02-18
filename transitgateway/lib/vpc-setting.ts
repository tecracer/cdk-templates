import cdk = require('@aws-cdk/core');
import { Vpc , CfnRouteTable, CfnRoute, CfnTransitGatewayAttachment,CfnVPCPeeringConnection,CfnVPCCidrBlock, SubnetType} from '@aws-cdk/aws-ec2'
import { Tag } from '@aws-cdk/core';
import { CdkTransitgatewayStack } from '../lib/cdk-transitgateway-stack';



export class VPCSetting extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, tgw: CdkTransitgatewayStack, props?: cdk.StackProps) {
    super(scope, id, props);

    const allCidr  = "0.0.0.0/0";
    const net1Cidr = "10.10.0.0/24";
    const net2Cidr = "192.168.1.0/24";

    const buildEnvTransitGateway = tgw.transitGateway;

    // VPC 1 *** START *****************
    const vpcA = new Vpc(this, "vpn",
    {
      cidr: net1Cidr,
      maxAzs: 2,
      enableDnsSupport: true,
      natGateways: 1,
      vpnGateway: false,
    });

    const vpcAAttachment = new CfnTransitGatewayAttachment(this, "base-attach",
    {
      transitGatewayId: buildEnvTransitGateway.ref,
      vpcId: vpcA.vpcId,
      subnetIds: [vpcA.privateSubnets[0].subnetId, vpcA.privateSubnets[1].subnetId],
      tags: [new Tag("Name","private-a-attach")],
    });
    
    for (var i = 0, len = vpcA.privateSubnets.length; i < len; i++) {
      new CfnRoute(this, "tgwVpc"+i,
      {
        routeTableId: vpcA.privateSubnets[i].routeTable.routeTableId,
        destinationCidrBlock: net2Cidr,
        transitGatewayId: buildEnvTransitGateway.ref,
      }).addDependsOn(vpcAAttachment);      

    }
    // VPC 1 *** END *****************

    // VPC 2 *** Start *****************
    const vpcB = new Vpc(this, "private",
    {
      cidr: net2Cidr,
      maxAzs: 2,
      natGateways: 1,
      vpnGateway: false,
    });
    
    const vpcBAttachement = new CfnTransitGatewayAttachment(this, "build-env-b-attach",
    {
      transitGatewayId: buildEnvTransitGateway.ref,
      vpcId: vpcB.vpcId,
      subnetIds: [vpcB.privateSubnets[0].subnetId, vpcB.privateSubnets[1].subnetId],
      tags: [new Tag("Name","private-b-attach")]
    });
    
    for (var i = 0, len = vpcA.privateSubnets.length; i < len; i++) {
      new CfnRoute(this, "tgwPrivVpc"+i,
      {
        routeTableId: vpcB.privateSubnets[i].routeTable.routeTableId,
        destinationCidrBlock: net1Cidr,
        transitGatewayId: buildEnvTransitGateway.ref,
      }).addDependsOn(vpcBAttachement);      
    }
    // VPC 2 *** END *****************
  



  }
}
