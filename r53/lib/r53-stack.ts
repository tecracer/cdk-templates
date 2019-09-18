import cdk = require('@aws-cdk/core');
import {ARecord,HostedZone,RecordTarget} from '@aws-cdk/aws-route53';

export class R53Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const domainName = "mydomain.de";
    const demoZone = new HostedZone(this, domainName,
      {
     zoneName: domainName,
      },
    );

    const aTarget = RecordTarget.fromIpAddresses("192.168.0.11","192.168.0.13")
  
    const aRecord = new ARecord(this,"ARecord",
    {
      target: aTarget,
      comment: "Demo  Record",
      ttl: cdk.Duration.seconds(300),
      recordName: "www",
      zone: demoZone,
    })
  
  }
  
}



