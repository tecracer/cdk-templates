import * as cdk from '@aws-cdk/core';
import { PolicyStatement, Effect } from '@aws-cdk/aws-iam';
import { AwsCustomResource, PhysicalResourceId, AwsCustomResourcePolicy } from '@aws-cdk/custom-resources';

export class AwsCustomResourceSesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Please change email adress
    const emailIdentity = "info@megaproaktiv.de"
    

    new AwsCustomResource(this, 'Identity', {
      onCreate: {
        service: 'SES',
        action: 'verifyEmailIdentity',
        parameters: {
          EmailAddress:  emailIdentity,
        },
        physicalResourceId: PhysicalResourceId.of("Identity"),
      },
      onDelete: {
        service: 'SES',
        action: 'deleteIdentity',
        parameters: {
          Identity:  emailIdentity,
        },
        physicalResourceId: PhysicalResourceId.of("Identity"),
        // PhysicalResourceId.fromResponse('VerificationToken') // Use the token returned by the call as physical id
      },
      policy: AwsCustomResourcePolicy.fromStatements(
        [ new PolicyStatement({
          actions: ['ses:verifyEmailIdentity',
                  'ses:deleteIdentity'],
          effect: Effect.ALLOW,
          resources: ['*']
        })]
        )
      });
      
  }
}
