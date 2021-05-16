package main_test

import (
	"testing"
	awstest "github.com/gruntwork-io/terratest/modules/aws"
)

const region="eu-central-1"

func TestVpcStack(t *testing.T) {
	
	// Is vpc really created?
	vpcId := awstest.GetParameter(t,region,"/cdk-templates/go/vpc")
	awstest.GetVpcById(t, vpcId,region)

}
