package main

import (
	"alb_ec2"
	"os"

	awscdk "github.com/aws/aws-cdk-go/awscdk/v2"

	// SDK
	aws "github.com/aws/aws-sdk-go-v2/aws"
)

func main() {
	app := awscdk.NewApp(nil)

	alb_ec2.NewAlbEC2Stack(app, "AlbInstStack", &alb_ec2.AlbEC2StackProps{
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