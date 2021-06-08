package main_test

import (
	"testing"
	awstest "github.com/gruntwork-io/terratest/modules/aws"
	aws "github.com/aws/aws-sdk-go-v2/aws"
	ec2 "github.com/megaproaktiv/cit/citec2"
	"github.com/stretchr/testify/assert"
)

const region="eu-central-1"

func TestVpcStackTerratest(t *testing.T) {
	
	// Is vpc really created?
	// For this test you have to export an ssm paramater
	vpcId := awstest.GetParameter(t,region,"/cdk-templates/go/vpc")
	vpc := awstest.GetVpcById(t, vpcId,region)
	// .. do your test here, but awstest.Vpc struct is limited
	assert.Equal(t, "VpcStack/MyVpc", vpc.Name)

}

func TestVpcCit(t *testing.T){
	// You just need the Stack and Construct Name
	vpc,err := ec2.GetVpc(aws.String("VpcStack"), aws.String("MyVpc"))
	assert.Nil(t,err)
	assert.Equal(t, "10.0.0.0/16",*vpc.CidrBlock)
	const name = "Name"
	for _, tag := range vpc.Tags {
		if *tag.Key == name {
				assert.Equal(t, "VpcStack/MyVpc",*tag.Value)
		}
}
	

}