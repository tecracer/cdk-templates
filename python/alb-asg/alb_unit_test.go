// +build unit all


package alb_ec2_test

import (
	// core
	"fmt"
	"io/ioutil"
	

	// test
	"testing"

	"github.com/tidwall/gjson"
	"gotest.tools/assert"


)

func TestAlbInstStack(t *testing.T) {
	// GIVEN
	data, err := ioutil.ReadFile("cdk.out/AlbAsgStack.template.json")
	if err != nil {
		fmt.Println("File reading error: ", err)
	}
	
	// THEN

	template := gjson.ParseBytes(data)
	scheme := template.Get("Resources.LB8A12904C.Properties.Scheme").String()
	assert.Equal(t, "internet-facing", scheme)
}