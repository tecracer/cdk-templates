import { Stack, StackProps } from 'aws-cdk-lib';
import { Role, ServicePrincipal, Policy, PolicyStatement, Effect } from 'aws-cdk-lib/lib/aws-iam';
import { Construct } from 'constructs';

export class OpscenterRoleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const opsRole = new Role(this, 'OpsCenterRole',{
      assumedBy: new ServicePrincipal('ssm.amazonaws.com'),

    })

    const opsPolicy = new Policy(this, "opsCenterPolicy",{
      policyName: "opsCenterPolicy",
    })
    opsPolicy.addStatements(new PolicyStatement({
      actions: ['ssm:CreateOpsItem'],
      effect: Effect.ALLOW,
      resources: ['*'],
    }),);
    
    opsRole.attachInlinePolicy(opsPolicy);
  }
}
