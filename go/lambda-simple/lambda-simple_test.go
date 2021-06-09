package main

import (
	"encoding/json"
	"testing"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/stretchr/testify/assert"
	"github.com/tidwall/gjson"

	"github.com/megaproaktiv/cit/citlambda"
)

func TestLambdaSimpleStack(t *testing.T) {
	// GIVEN
	app := awscdk.NewApp(nil)

	// WHEN
	stack := NewLambdaSimpleStack(app, "MyStack", nil)

	// THEN
	bytes, err := json.Marshal(app.Synth(nil).GetStackArtifact(stack.ArtifactId()).Template())
	if err != nil {
		t.Error(err)
	}

	template := gjson.ParseBytes(bytes)
	handler := template.Get("Resources.HelloHandler2E4FBA4D.Properties.Handler").String()
	assert.Equal(t, "hello.handler", handler)
}

func TestCitLambda(t *testing.T){

	gotFc, err := citlambda.GetFunctionConfiguration(aws.String("LambdaSimpleStack"),
	aws.String("HelloHandler"))
	assert.Nil(t, err, "GetFunctionConfiguration should return no error")
	expectHandler := "hello.handler"
	assert.Equal(t, &expectHandler, gotFc.Handler )

}