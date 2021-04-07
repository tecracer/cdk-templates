package main

import (
	"github.com/aws/aws-cdk-go/awscdk"
	"github.com/aws/aws-cdk-go/awscdk/awsec2"
	"github.com/aws/constructs-go/constructs/v3"
	"github.com/aws/jsii-runtime-go"
	"os"
)

type GoVpcStackProps struct {
	awscdk.StackProps
}

func NewGoVpcStack(scope constructs.Construct, id string, props *GoVpcStackProps) awscdk.Stack {
	var sprops awscdk.StackProps
	if props != nil {
		sprops = props.StackProps
	}
	stack := awscdk.NewStack(scope, &id, &sprops)

	// The code that defines your stack goes here
	myVpc := awsec2.NewVpc(stack, jsii.String("MyVpc"),
		&awsec2.VpcProps{
			Cidr: jsii.String("10.0.0.0/16"),
		},
	)

	awscdk.NewCfnOutput(stack, jsii.String("VPCId"),
		&awscdk.CfnOutputProps{
			Value: myVpc.GeneratePhysicalName(),
		})

	return stack
}

func main() {
	app := awscdk.NewApp(nil)

	NewGoVpcStack(app, "GoVpcStack", &GoVpcStackProps{
		awscdk.StackProps{
			Env: Env(),
		},
	})

	app.Synth(nil)
}

// Env determines the AWS environment (account+region) in which our stack is to
// be deployed. For more information see: https://docs.aws.amazon.com/cdk/latest/guide/environments.html
func Env() *awscdk.Environment {
	return &awscdk.Environment{
		Account: jsii.String(os.Getenv("CDK_DEFAULT_ACCOUNT")),
		Region:  jsii.String(os.Getenv("CDK_DEFAULT_REGION")),
	}
}
