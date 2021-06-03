package main

import (
	"fmt"
	// CDK
	awscdk "github.com/aws/aws-cdk-go/awscdk/v2"
	constructs "github.com/aws/constructs-go/constructs/v10"
	// Services
	iam "github.com/aws/aws-cdk-go/awscdk/v2/awsiam"
	// SDK
	aws "github.com/aws/aws-sdk-go-v2/aws"
)

type IamUserStackProps struct {
	awscdk.StackProps
}

func NewIamUserStack(scope constructs.Construct, id string, props *IamUserStackProps) awscdk.Stack {
	var sprops awscdk.StackProps
	if props != nil {
		sprops = props.StackProps
	}
	stack := awscdk.NewStack(scope, &id, &sprops)

	// The code that defines your stack goes here
	const ammount = 6
	const prefix = "student"
	group := iam.NewGroup(stack, aws.String("trainigsUserGroup"), 
		&iam.GroupProps{})	

	// Changeme
	password := awscdk.SecretValue_SecretsManager(
		aws.String("trainingsuserpassword"),
		&awscdk.SecretsManagerSecretOptions{},
	)	
	for i:=1; i<=ammount; i++ {
		newid := fmt.Sprintf("%s_%d",prefix,i)
        iam.NewUser(stack, &newid, 
		&iam.UserProps{
			Groups:                &[]iam.IGroup{group},
			Password:              password,
			PasswordResetRequired: aws.Bool(true),
			UserName:              &newid,
		})
    }  
	
	return stack
}

func main() {
	app := awscdk.NewApp(nil)

	NewIamUserStack(app, "IamUserStack", &IamUserStackProps{
		awscdk.StackProps{
			Env: env(),
		},
	})

	app.Synth(nil)
}

// env determines the AWS environment (account+region) in which our stack is to
// be deployed. For more information see: https://docs.aws.amazon.com/cdk/latest/guide/environments.html
func env() *awscdk.Environment {
	// If unspecified, this stack will be "environment-agnostic".
	// Account/Region-dependent features and context lookups will not work, but a
	// single synthesized template can be deployed anywhere.
	//---------------------------------------------------------------------------
	return nil

	// Uncomment if you know exactly what account and region you want to deploy
	// the stack to. This is the recommendation for production stacks.
	//---------------------------------------------------------------------------
	// return &awscdk.Environment{
	//  Account: jsii.String("123456789012"),
	//  Region:  jsii.String("us-east-1"),
	// }

	// Uncomment to specialize this stack for the AWS Account and Region that are
	// implied by the current CLI configuration. This is recommended for dev
	// stacks.
	//---------------------------------------------------------------------------
	// return &awscdk.Environment{
	//  Account: jsii.String(os.Getenv("CDK_DEFAULT_ACCOUNT")),
	//  Region:  jsii.String(os.Getenv("CDK_DEFAULT_REGION")),
	// }
}
