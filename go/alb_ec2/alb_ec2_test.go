package main_test

import (
	"fmt"
	"testing"
	"time"
	aws "github.com/gruntwork-io/terratest/modules/aws"
	http_helper "github.com/gruntwork-io/terratest/modules/http-helper"
)

const region="eu-central-1"


func TestALBRequest(t *testing.T) {
	
	storedUrl := aws.GetParameter(t,region,"/cdk-templates/go/alb_ec2")

	url := fmt.Sprintf("http://%s", storedUrl)

	sleepBetweenRetries, error := time.ParseDuration("10s")

	if error != nil {
		panic("Can't parse duration")
	}

	http_helper.HttpGetWithRetry(t, url, nil, 200 , "<h1>hello world</h1>", 20, sleepBetweenRetries)
	
}

