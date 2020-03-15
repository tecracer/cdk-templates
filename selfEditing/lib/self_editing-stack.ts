import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { Group, PolicyStatement, Effect } from '@aws-cdk/aws-iam'

export interface SelfEditingProps extends StackProps {
  /**
   * Enable login password management
   * @default true
   */
  passwordEditingAllowed?: boolean,
  /**
   * Enable access key management
   * @default false
   */
  accessKeyManagementAllowed?: boolean, 
  /**
   * Enable SSH key management
   * @default false
   */
  sshKeyManagementAllowed?: boolean,
  /**
   * MFA management allowed
   * @default false
   */
  MFAManagementAllowed?: boolean,
  /**
   * Block MostA ccess Unless Signed In With MFA
   * @default false
   */
  blockNonMFAAccess?: boolean
}


export class SelfEditingStack extends Stack {
  constructor(scope: Construct, id: string, myProps?: SelfEditingProps, props?: StackProps) {
    super(scope, id, props);
  
    // The code that defines your stack goes here
    const selfEdit = new Group(this, "selfEdit", {
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

    const userOnlyResource = "arn:aws:iam::*:user/${aws:username}"
    const mfaOnlyResource = "arn:aws:iam::*:mfa/${aws:username}"
    // AllowManageOwnPasswords
    var passwordEditingAllowed = true;
    if(myProps !== undefined && myProps.passwordEditingAllowed !== undefined ){
      passwordEditingAllowed = myProps.passwordEditingAllowed ;
    }
    if( passwordEditingAllowed){
      selfEdit.addToPolicy(new PolicyStatement({
        resources: [userOnlyResource],
        actions: [
          "iam:ChangePassword",
          "iam:GetUser"
        ]
      }));
    }

    // AllowManageOwnAccessKeys
    var accessKeyManagementAllowed = false;
    if(myProps !== undefined && myProps.accessKeyManagementAllowed !== undefined ){
      accessKeyManagementAllowed = myProps.accessKeyManagementAllowed ;
    }
    if( accessKeyManagementAllowed){
      selfEdit.addToPolicy(new PolicyStatement({
        resources: [userOnlyResource],
        actions: [
          "iam:CreateAccessKey",
          "iam:DeleteAccessKey",
          "iam:ListAccessKeys",
          "iam:UpdateAccessKey"
        ]
      }));
    }
      
    // AllowManageOwnSSHPublicKeys
    var sshKeyManagementAllowed = false;
    if(myProps !== undefined && myProps.sshKeyManagementAllowed !== undefined ){
      sshKeyManagementAllowed = myProps.sshKeyManagementAllowed ;
    }
    if( sshKeyManagementAllowed){

      selfEdit.addToPolicy(new PolicyStatement({
        resources: [userOnlyResource],
        actions: [
          "iam:DeleteSSHPublicKey",
          "iam:GetSSHPublicKey",
          "iam:ListSSHPublicKeys",
          "iam:UpdateSSHPublicKey",
          "iam:UploadSSHPublicKey"
        ]
      }));
    }
    
    // AllowListActions
    var MFAManagementAllowed = false;
    if(myProps !== undefined && myProps.MFAManagementAllowed !== undefined ){
      MFAManagementAllowed = myProps.MFAManagementAllowed ;
    }
    if( MFAManagementAllowed){
      selfEdit.addToPolicy(new PolicyStatement({
        resources: ["*"],
        actions: [
          "iam:ListUsers",
          "iam:ListVirtualMFADevices"
        ]
      }))
    }
    // AllowIndividualUserToListOnlyTheirOwnMFA
    if(MFAManagementAllowed ){

      selfEdit.addToPolicy(new PolicyStatement({
        resources: [mfaOnlyResource, userOnlyResource],
        actions: [
          "iam:ListMFADevices",
        ]
      }));
      
      // AllowIndividualUserToManageTheirOwnMFA
      selfEdit.addToPolicy(new PolicyStatement({
        resources: [mfaOnlyResource, userOnlyResource],
        actions: [
          "iam:CreateVirtualMFADevice",
          "iam:DeleteVirtualMFADevice",
          "iam:EnableMFADevice",
          "iam:ResyncMFADevice"
        ]
      }));
      // AllowIndividualUserToDeactivateOnlyTheirOwnMFAOnlyWhenUsingMFA
      selfEdit.addToPolicy(new PolicyStatement({
        resources: [mfaOnlyResource, userOnlyResource],
        actions: [
          "iam:DeactivateMFADevice"
        ]
      }));
    }


   
    var blockNonMFAAccess = false;
    if(myProps !== undefined && myProps.blockNonMFAAccess !== undefined ){
      blockNonMFAAccess = myProps.blockNonMFAAccess ;
    }
    // AllowIndividualUserToListOnlyTheirOwnMFA
    if(blockNonMFAAccess ){
      // BlockMostAccessUnlessSignedInWithMFA
      selfEdit.addToPolicy(new PolicyStatement({
        effect: Effect.DENY,
        resources: ['*'],
        notActions: [
          "iam:CreateVirtualMFADevice",
          "iam:EnableMFADevice",
          "iam:ListMFADevices",
          "iam:ListUsers",
          "iam:ListVirtualMFADevices",
          "iam:ResyncMFADevice"
        ],
        conditions: {"BoolIfExists": {
          "aws:MultiFactorAuthPresent": "false"
          }
        }
      }))
    }


  }
}
