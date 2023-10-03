package embedding

import (
	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsec2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsssm"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/constructs-go/constructs/v10"
)

type VpcStackProps struct {
	StackProps awscdk.StackProps
}

func NewVpcStack(scope constructs.Construct, id string, props *VpcStackProps) awscdk.Stack {
	var sprops awscdk.StackProps
	if props != nil {
		sprops = props.StackProps
	}
	stack := awscdk.NewStack(scope, &id, &sprops)

	myVpc := awsec2.NewVpc(stack, aws.String("basevpc"),
		&awsec2.VpcProps{
			IpAddresses: awsec2.IpAddresses_Cidr(aws.String("10.0.0.0/16")),
			MaxAzs:      aws.Float64(2),
		},
	)

	awsssm.NewStringParameter(stack, aws.String("basevpc-parm"),
		&awsssm.StringParameterProps{
			Description:   aws.String("Created VPC"),
			ParameterName: aws.String("/network/basevpc"),
			StringValue:   myVpc.VpcId(),
		},
	)

	awscdk.NewCfnOutput(stack, aws.String("basevpc-output"),
		&awscdk.CfnOutputProps{
			Value:       myVpc.VpcId(),
			Description: aws.String("Created VPC"),
		},
	)

	return stack
}
