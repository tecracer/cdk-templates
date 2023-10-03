package main

import (
	"os"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-sdk-go-v2/aws"

	// "github.com/aws/aws-cdk-go/awscdk/v2/awssqs"
	"embedding"

	"github.com/aws/jsii-runtime-go"
)

func main() {
	defer jsii.Close()

	app := awscdk.NewApp(nil)

	embedding.NewVpcStack(app, "vpc", &embedding.VpcStackProps{
		StackProps: awscdk.StackProps{
			Env: env(),
		},
	},
	)

	embedding.NewAuroraStack(app, "aurora", &embedding.AuroraStackProps{
		StackProps: awscdk.StackProps{
			Env: env(),
		},
	},
	)

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
