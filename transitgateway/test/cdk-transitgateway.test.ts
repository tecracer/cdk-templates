import { expect as expectCDK, matchTemplate, MatchStyle, haveResource, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import CdkTransitgateway = require('../lib/cdk-transitgateway-stack');
import {VPCSetting} from '../lib/vpc-setting'


test('Transitgateway Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CdkTransitgateway.CdkTransitgatewayStack(app, 'MyTestStack');
    const stackVpc = new VPCSetting(app, "MyVPCTestStack", stack)
    // THEN
    expectCDK(stack).to(
      haveResource('AWS::EC2::TransitGateway',{
        AmazonSideAsn: 65000,
    }))


    expectCDK(stackVpc).to(countResources("AWS::EC2::VPC",2))

});

