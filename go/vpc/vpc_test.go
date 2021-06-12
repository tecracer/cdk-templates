package main

import (
	"encoding/json"
	"testing"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	aws "github.com/aws/aws-sdk-go-v2/aws"
	awstest "github.com/gruntwork-io/terratest/modules/aws"
	ec2 "github.com/megaproaktiv/cit/citec2"
	"github.com/stretchr/testify/assert"
	"github.com/tidwall/gjson"
)

const region="eu-central-1"

func TestVpcStackTerratest(t *testing.T) {
	if testing.Short() {
        t.Skip("skipping integration test in short mode.")
    }
	// Is vpc really created?
	// For this test you have to export an ssm paramater
	vpcId := awstest.GetParameter(t,region,"/cdk-templates/go/vpc")
	vpc := awstest.GetVpcById(t, vpcId,region)
	// .. do your test here, but awstest.Vpc struct is limited
	assert.Equal(t, "VpcStack/MyVpc", vpc.Name)

}

func TestVpcCit(t *testing.T){
	if testing.Short() {
        t.Skip("skipping integration test in short mode.")
    }
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

func TestVpcStack(t *testing.T){
	app := awscdk.NewApp(nil)
	stack := 	NewVpcStack(app, "VpcStack", &VpcStackProps{
		awscdk.StackProps{},
	})
	bytes, err := json.Marshal(app.Synth(nil).GetStackArtifact(stack.ArtifactId()).Template())
	if err != nil {
			t.Error(err)
	}

	template := gjson.ParseBytes(bytes)
	cidrrange := template.Get("Resources.MyVpcF9F0CA6F.Properties.CidrBlock").String()

	assert.Equal(t, "10.0.0.0/16", cidrrange, "Cidr Range should be /16")
}