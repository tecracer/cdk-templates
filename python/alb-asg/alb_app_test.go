// +build app all

package alb_ec2_test

import (
	// core
	"fmt"
	"time"

	// test
	"testing"

	http_helper "github.com/gruntwork-io/terratest/modules/http-helper"

	"github.com/megaproaktiv/cit/citalbv2"
	"gotest.tools/assert"

	// sdk
	"github.com/aws/aws-sdk-go-v2/aws"
)

const region="eu-central-1"


func TestALBRequest(t *testing.T) {
	if testing.Short() {
        t.Skip("skipping integration test in short mode.")
    }
	
	alb, err := citalbv2.GetLoadBalancer(aws.String("AlbAsgStack"), aws.String("LB"))
	assert.NilError(t,err,"The LoadBalancer should be retrievable without error")

	storedUrl := alb.DNSName

	url := fmt.Sprintf("http://%s", *storedUrl)

	sleepBetweenRetries, error := time.ParseDuration("10s")

	if error != nil {
		panic("Can't parse duration")
	}

	http_helper.HttpGetWithRetry(t, url, nil, 200 , "<h1>hello world</h1>", 20, sleepBetweenRetries)
	
}
