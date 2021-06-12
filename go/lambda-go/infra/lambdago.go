package lambdago

import (
	"log"
	"os"
	"path/filepath"

	awscdk "github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awslambda"
	"github.com/aws/aws-cdk-go/awscdk/v2/awss3assets"
	"github.com/aws/constructs-go/constructs/v10"

	// SDK
	aws "github.com/aws/aws-sdk-go-v2/aws"
)

type LambdaGoStackProps struct {
	awscdk.StackProps
}

func NewLambdaGoStack(scope constructs.Construct, id string, props *LambdaGoStackProps) awscdk.Stack {
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
	lambdaPath := filepath.Join(path, "../dist/main.zip")
	awslambda.NewFunction(stack,
		aws.String("HelloHandler"),
		&awslambda.FunctionProps{
			MemorySize: aws.Float64(1024),
			Code: awslambda.Code_FromAsset(&lambdaPath, &awss3assets.AssetOptions{}),
			Handler: aws.String("main"),
			Runtime: awslambda.Runtime_GO_1_X(),
		})

	return stack
}
