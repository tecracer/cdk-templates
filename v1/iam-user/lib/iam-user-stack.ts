import cdk = require('@aws-cdk/core');
import {Group,User} from '@aws-cdk/aws-iam'
import { SecretValue, CfnOutput } from '@aws-cdk/core';

// Create a bunch of users for demo or training accounts

export class IamUserStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // How many users?
    const ammount = 6;
    const prefix = 'student';

    // A group for the users
    // Add policy manually later
    const group=new Group(this, "trainigsUserGroup", {});

   

    const password = SecretValue.secretsManager('trainingsuserpassword');

    for (let index = 1; index <= ammount; index++) {
      new User(this, prefix+index.toString(),
      {
        password: password,
        passwordResetRequired: true,
        groups: [group],
        userName: prefix+index.toString()
      } 
      ) 
    }



  }
}
