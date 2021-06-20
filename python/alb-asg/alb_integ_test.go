// +build integ all

package alb_ec2_test

import (
	
	// test
	"testing"

	
	"github.com/megaproaktiv/cit/citalbv2"
	"gotest.tools/assert"

	// sdk
	"github.com/aws/aws-sdk-go-v2/aws"
	awselbv2types "github.com/aws/aws-sdk-go-v2/service/elasticloadbalancingv2/types"
)


func TestAlbPhysicalResource( t *testing.T){
	if testing.Short() {
        t.Skip("skipping integration test in short mode.")
    }
	alb, err := citalbv2.GetLoadBalancer(aws.String("AlbAsgStack"), aws.String("LB"))
	assert.NilError(t,err,"The LoadBalancer should be retrievable without error")
	// Just read anything from alb
	applicationType := awselbv2types.LoadBalancerTypeEnumApplication
	assert.Equal(t, applicationType, alb.Type)
}
