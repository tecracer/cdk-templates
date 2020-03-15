import { expect, matchTemplate, haveResource, beASupersetOfTemplate, haveResourceLike, MatchStyle } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import SelfEditing = require('../lib/self_editing-stack');


test('Default Settings ', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new SelfEditing.SelfEditingStack(app, 'MyTestStack');
  // THEN
 
  expect(stack).to(matchTemplate({ Resources:
    { selfEditDefaultPolicyB4B338D3:
       { Type: 'AWS::IAM::Policy',
        Properties:
          { 
            PolicyDocument:
              { Statement:
                [ 
                  { 
                    Action: [
                      "iam:GetAccountPasswordPolicy",
                      "iam:GetAccountSummary"
                    ],
                    Effect: 'Allow', 
                    Resource: '*' 
                  }
                ,
                  {
                    Action: [
                      "iam:ChangePassword",
                      "iam:GetUser"
                    ],
                    Effect: "Allow",
                    Resource: "arn:aws:iam::*:user/${aws:username}"
                  },
                ],
                Version: "2012-10-17"
              }, 
              PolicyName: "selfEditDefaultPolicyB4B338D3",
              Groups: [
                {
                  "Ref": "selfEditF595E1F8"
                }
              ]
          }
        }
      }
    },
    MatchStyle.SUPERSET))
          
});


test('SSH Enable Settings ', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new SelfEditing.SelfEditingStack(app, 'MyTestStack', 
  {
    sshKeyManagementAllowed: true
  });
  // THEN
 
  expect(stack).to(matchTemplate({ Resources:
    { selfEditDefaultPolicyB4B338D3:
       { Type: 'AWS::IAM::Policy',
        Properties:
          { 
            PolicyDocument:
              { Statement:
                [ 
                  { 
                    Action: [
                      "iam:GetAccountPasswordPolicy",
                      "iam:GetAccountSummary"
                    ],
                    Effect: 'Allow', 
                    Resource: '*' 
                  }
                ,
                  {
                    Action: [
                      "iam:ChangePassword",
                      "iam:GetUser"
                    ],
                    Effect: "Allow",
                    Resource: "arn:aws:iam::*:user/${aws:username}"
                  },
                  {
                    Action: [
                      "iam:DeleteSSHPublicKey",
                      "iam:GetSSHPublicKey",
                      "iam:ListSSHPublicKeys",
                      "iam:UpdateSSHPublicKey",
                      "iam:UploadSSHPublicKey"
                    ],
                    Effect: "Allow",
                    Resource: "arn:aws:iam::*:user/${aws:username}"
                  },
                ],
                Version: "2012-10-17"
              }, 
              PolicyName: "selfEditDefaultPolicyB4B338D3",
              Groups: [
                {
                  "Ref": "selfEditF595E1F8"
                }
              ]
              
          }
        }
      }
    },
    MatchStyle.SUPERSET))
          
});


test('access management  Settings ', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new SelfEditing.SelfEditingStack(app, 'MyTestStack', 
  {
    accessKeyManagementAllowed: true
  });
  // THEN
 
  expect(stack).to(matchTemplate({ Resources:
    { selfEditDefaultPolicyB4B338D3:
       { Type: 'AWS::IAM::Policy',
        Properties:
          { 
            PolicyDocument:
              { Statement:
                [ 
                  { 
                    Action: [
                      "iam:GetAccountPasswordPolicy",
                      "iam:GetAccountSummary"
                    ],
                    Effect: 'Allow', 
                    Resource: '*' 
                  }
                ,
                  {
                    Action: [
                      "iam:ChangePassword",
                      "iam:GetUser"
                    ],
                    Effect: "Allow",
                    Resource: "arn:aws:iam::*:user/${aws:username}"
                  },
                  {
                    Action: [
                      "iam:CreateAccessKey",
                      "iam:DeleteAccessKey",
                      "iam:ListAccessKeys",
                      "iam:UpdateAccessKey"
                    ],
                    Effect: "Allow",
                    Resource: "arn:aws:iam::*:user/${aws:username}"
                  },
                ],
                Version: "2012-10-17"
              }, 
              PolicyName: "selfEditDefaultPolicyB4B338D3",
              Groups: [
                {
                  "Ref": "selfEditF595E1F8"
                }
              ]
              
          }
        }
      }
    },
    MatchStyle.SUPERSET))
          
});