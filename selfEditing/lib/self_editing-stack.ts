import * as cdk from '@aws-cdk/core';
import {Group, PolicyStatement} from '@aws-cdk/aws-iam'

export class SelfEditingStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const selfEdit = new Group(this, "selfEdit",{
      groupName: "SelfEdit",
    });

    // AllowViewAccountInfo
    selfEdit.addToPolicy(new PolicyStatement({
      resources: ['*'],
      actions: [
        "iam:GetAccountPasswordPolicy",
        "iam:GetAccountSummary"
    ],
    }
    ));

    const userOnlyResource ="arn:aws:iam::*:user/${aws:username}"
    const mfaOnlyResource ="arn:aws:iam::*:mfa/${aws:username}"
    // AllowManageOwnPasswords
    selfEdit.addToPolicy( new PolicyStatement({
      resources: [userOnlyResource],
      actions: [ 
        "iam:ChangePassword",
        "iam:GetUser"
    ]
    }));

    // AllowManageOwnAccessKeys
    selfEdit.addToPolicy( new PolicyStatement({
      resources: [ userOnlyResource],
      actions: [
        "iam:CreateAccessKey",
        "iam:DeleteAccessKey",
        "iam:ListAccessKeys",
        "iam:UpdateAccessKey"
      ]
    }));

    // AllowManageOwnSSHPublicKeys
    selfEdit.addToPolicy( new PolicyStatement({
      resources: [ userOnlyResource],
      actions: [
        "iam:DeleteSSHPublicKey",
        "iam:GetSSHPublicKey",
        "iam:ListSSHPublicKeys",
        "iam:UpdateSSHPublicKey",
        "iam:UploadSSHPublicKey"
      ]
    }));

    // AllowListActions
    selfEdit.addToPolicy( new PolicyStatement({
      resources: ["*"],
      actions: [
        "iam:ListUsers",
        "iam:ListVirtualMFADevices"
      ]
    }))
    
    // AllowIndividualUserToListOnlyTheirOwnMFA
    selfEdit.addToPolicy( new PolicyStatement({
      resources: [mfaOnlyResource, userOnlyResource],
      actions: [
        "iam:ListMFADevices",
      ]
    }));
    
    // AllowIndividualUserToManageTheirOwnMFA
    selfEdit.addToPolicy( new PolicyStatement({
      resources: [mfaOnlyResource, userOnlyResource],
      actions: [
        "iam:CreateVirtualMFADevice",
        "iam:DeleteVirtualMFADevice",
        "iam:EnableMFADevice",
        "iam:ResyncMFADevice"
      ]
    }));
    
    // AllowIndividualUserToDeactivateOnlyTheirOwnMFAOnlyWhenUsingMFA
    selfEdit.addToPolicy( new PolicyStatement({
      resources: [mfaOnlyResource, userOnlyResource],
      actions: [
        "iam:DeactivateMFADevice"
      ]
    }));



  }
}
