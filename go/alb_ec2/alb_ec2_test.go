package alb_ec2_test

import (
	// core
	"encoding/json"
	"fmt"
	"time"

	// test
	"testing"

	terratest_aws "github.com/gruntwork-io/terratest/modules/aws"
	http_helper "github.com/gruntwork-io/terratest/modules/http-helper"
	"github.com/megaproaktiv/cit/citalbv2"
	"github.com/tidwall/gjson"
	"gotest.tools/assert"

	// cdk
	"github.com/aws/aws-cdk-go/awscdk/v2"
	// sdk
	"github.com/aws/aws-sdk-go-v2/aws"
	awselbv2types "github.com/aws/aws-sdk-go-v2/service/elasticloadbalancingv2/types"

	"alb_ec2"
	
)

const region="eu-central-1"


func TestALBRequest(t *testing.T) {
	if testing.Short() {
        t.Skip("skipping integration test in short mode.")
    }
	storedUrl := terratest_aws.GetParameter(t,region,"/cdk-templates/go/alb_ec2")

	url := fmt.Sprintf("http://%s", storedUrl)

	sleepBetweenRetries, error := time.ParseDuration("10s")

	if error != nil {
		panic("Can't parse duration")
	}

	http_helper.HttpGetWithRetry(t, url, nil, 200 , "<h1>hello world</h1>", 20, sleepBetweenRetries)
	
}

func TestAlbPhysicalResource( t *testing.T){
	if testing.Short() {
        t.Skip("skipping integration test in short mode.")
    }
	alb, err := citalbv2.GetLoadBalancer(aws.String("AlbInstStack"), aws.String("LB"))
	assert.NilError(t,err,"The LoadBalancer should be retrievable without error")
	// Just read anything from alb
	applicationType := awselbv2types.LoadBalancerTypeEnumApplication
	assert.Equal(t, applicationType, alb.Type)
	assert.Equal(t, 1, len(alb.SecurityGroups), "One SecurityGroup should be attached")
}

func TestAlbInstStack(t *testing.T) {
	// GIVEN
	app := awscdk.NewApp(nil)

	// WHEN
	stack := alb_ec2.NewAlbEC2Stack(app, "MyStack", nil)

	// THEN
	bytes, err := json.Marshal(app.Synth(nil).GetStackArtifact(stack.ArtifactId()).Template())
	if err != nil {
			t.Error(err)
	}

	template := gjson.ParseBytes(bytes)
	albName := template.Get("Resources.LB8A12904C.Properties.Name").String()
	assert.Equal(t, "ALBGODEMO", albName)
}