package main

import (
	// CDK
	"log"
	"os"
	"path/filepath"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awslambda"
	"github.com/aws/aws-cdk-go/awscdk/v2/awss3assets"
	"github.com/aws/constructs-go/constructs/v10"

	// SDK
	"github.com/aws/aws-sdk-go-v2/aws"
)

type LambdaSimpleStackProps struct {
	awscdk.StackProps
}

func NewLambdaSimpleStack(scope constructs.Construct, id string, props *LambdaSimpleStackProps) awscdk.Stack {
	var sprops awscdk.StackProps
	if props != nil {
		sprops = props.StackProps
	}
	stack := awscdk.NewStack(scope, &id, &sprops)

	// The code that defines your stack goes here
	path, err := os.Getwd()
	if err != nil {
		log.Println(err)
	}
	lambdaPath := filepath.Join(path, "lambda")
	awslambda.NewFunction(stack, 
		aws.String("HelloHandler"),
		&awslambda.FunctionProps{
			MemorySize:                   aws.Float64(1024),
			Code:                         awslambda.Code_FromAsset(&lambdaPath, 
				&awss3assets.AssetOptions{}),
			Handler:                      aws.String("hello.handler"),
			Runtime:                      awslambda.Runtime_NODEJS_14_X(),
		})


	return stack
}

func main() {
	app := awscdk.NewApp(nil)

	NewLambdaSimpleStack(app, "LambdaSimpleStack", &LambdaSimpleStackProps{
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
