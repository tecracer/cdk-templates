package main

import (
	"os"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsec2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsssm"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
)

type VpcStackProps struct {
	awscdk.StackProps
}



func NewVpcStack(scope constructs.Construct, id string, props *VpcStackProps) awscdk.Stack {
	var sprops awscdk.StackProps
	if props != nil {
		sprops = props.StackProps
	}
	stack := awscdk.NewStack(scope, &id, &sprops)

	// The code that defines your stack goes here
	// The code that defines your stack goes here
	myVpc := awsec2.NewVpc(stack, aws.String("MyVpc"),
		&awsec2.VpcProps{
			Cidr: jsii.String("10.0.0.0/16"),
			MaxAzs: aws.Float64(1),
		},
	)

	awsssm.NewStringParameter(stack, aws.String("govpc"),
		&awsssm.StringParameterProps{
			Description:    aws.String("Created VPC"),
			ParameterName:  aws.String("/cdk-templates/go/vpc"),
			StringValue:    myVpc.VpcId(),
		},
	)

	return stack
}

func main() {
	app := awscdk.NewApp(nil)

	NewVpcStack(app, "VpcStack", &VpcStackProps{
		awscdk.StackProps{
			Env: env(),
		},
	})

	app.Synth(nil)
}

// env determines the AWS environment (account+region) in which our stack is to
// be deployed. For more information see: https://docs.aws.amazon.com/cdk/latest/guide/environments.html
func env() *awscdk.Environment {
	return &awscdk.Environment{
	 Account: aws.String(os.Getenv("CDK_DEFAULT_ACCOUNT")),
	 Region:  aws.String(os.Getenv("CDK_DEFAULT_REGION")),
	}
}
