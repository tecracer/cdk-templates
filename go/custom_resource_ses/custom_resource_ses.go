package main

import (
	// cdk
	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsiam"
	"github.com/aws/aws-cdk-go/awscdk/v2/customresources"
	"github.com/aws/constructs-go/constructs/v10"

	// SDK
	"github.com/aws/aws-sdk-go-v2/aws"
)

type CustomResourceSesStackProps struct {
	awscdk.StackProps
}


func NewCustomResourceSesStack(scope constructs.Construct, id string, props *CustomResourceSesStackProps) awscdk.Stack {
	var sprops awscdk.StackProps
	if props != nil {
		sprops = props.StackProps
	}
	stack := awscdk.NewStack(scope, &id, &sprops)
	emailIdentity := "info@megaproaktiv.de"

	physicalResourceId := "Identity"
	// The code that defines your stack goes here
	policyStatement01 := awsiam.NewPolicyStatement(&awsiam.PolicyStatementProps{
		Actions:       &[]*string{	aws.String("ses:verifyEmailIdentity"),
		aws.String("ses:deleteIdentity"),},
		Conditions:    &map[string]interface{}{},
		Effect:        awsiam.Effect_ALLOW,
		Resources:     &[]*string{ aws.String("*")},
	})
	crp := customresources.AwsCustomResourcePolicy_FromStatements(&[]awsiam.PolicyStatement{policyStatement01})
	
	// a does not work as Parameters
	// parameterCreate :=&ses.VerifyEmailAddressInput{
	// 	EmailAddress: &emailIdentity,
	// }
	// a, _ := json.Marshal(parameterCreate.EmailAddress)
	// b does not work as Parameters
	// b := 	string(a)
	// fmt.Println(b)
	// c does not work
	// fmt.Sprintf("{%v: %q}","EmailAddress",emailIdentity),

	// d does work
	d := make(map[string]string)
	d["EmailAddress"] = emailIdentity
	

	customresources.NewAwsCustomResource(stack, &physicalResourceId, 
		&customresources.AwsCustomResourceProps{
		OnCreate:            &customresources.AwsSdkCall{
			Action:                   aws.String("verifyEmailIdentity"),
			Service:                  aws.String("SES"),
			Parameters:               d,
			PhysicalResourceId:       customresources.PhysicalResourceId_Of(&physicalResourceId),
		},
		OnDelete:            &customresources.AwsSdkCall{
			Action:                   aws.String("deleteIdentity"),
			Service:                  aws.String("SES"),
			Parameters:               &map[string]string{
				"Identity": emailIdentity,
			},
			PhysicalResourceId:       customresources.PhysicalResourceId_Of(&physicalResourceId),
		},
		Policy:crp,
		InstallLatestAwsSdk: aws.Bool(false),
		
		},
	)

	return stack
}

func main() {
	app := awscdk.NewApp(nil)

	NewCustomResourceSesStack(app, "CustomResourceSesStack", &CustomResourceSesStackProps{
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
