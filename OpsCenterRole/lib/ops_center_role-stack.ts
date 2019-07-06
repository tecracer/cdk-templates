import cdk = require('@aws-cdk/core');
import iam = require('@aws-cdk/aws-iam');

export class OpsCenterRoleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const opsRole = new iam.Role(this, 'OpsCenterRole',{
      assumedBy: new iam.ServicePrincipal('ssm.amazonaws.com'),

    })

    const opsPolicy = new iam.Policy(this, "opsCenterPolicy",{
      policyName: "opsCenterPolicy",
    })
    opsPolicy.addStatements(new iam.PolicyStatement({
      actions: ['ssm:CreateOpsItem'],
      effect: iam.Effect.ALLOW,
      resources: ['*'],
    }),);
    
    opsRole.attachInlinePolicy(opsPolicy);

  }
}
