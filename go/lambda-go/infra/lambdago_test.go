package lambdago_test

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"testing"

	"lambdago"

	awscdk "github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/tidwall/gjson"
	"gotest.tools/assert"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/megaproaktiv/cit/citlambda"

	"github.com/aws/aws-sdk-go-v2/service/lambda"
)

func TestLambdaGoStack(t *testing.T) {
	// GIVEN
	app := awscdk.NewApp(nil)

	// WHEN
	stack := lambdago.NewLambdaGoStack(app, "MyStack", nil)

	// THEN
	bytes, err := json.Marshal(app.Synth(nil).GetStackArtifact(stack.ArtifactId()).Template())
	if err != nil {
		t.Error(err)
	}

	template := gjson.ParseBytes(bytes)
	lambdaruntime := template.Get("Resources.HelloHandler2E4FBA4D.Properties.Runtime").String()
	assert.Equal(t, "go1.x", lambdaruntime)
}

func TestLambdaGoCit(t *testing.T){
	if testing.Short() {
        t.Skip("skipping integration test in short mode.")
    }
	gotFunctionConfiguration, err := citlambda.GetFunctionConfiguration(aws.String("LambdaGoStack"),
	aws.String("HelloHandler"))
	assert.NilError(t, err, "GetFunctionConfiguration should return no error")
	expectHandler := "main"
	assert.Equal(t, expectHandler, *gotFunctionConfiguration.Handler )
}

func TestLambdaGoApp(t *testing.T){
	if testing.Short() {
		t.Skip("skipping integration test in short mode.")
    }
	gotFunctionConfiguration, err := citlambda.GetFunctionConfiguration(
		aws.String("LambdaGoStack"),
		aws.String("HelloHandler"))
	assert.NilError(t, err, "GetFunctionConfiguration should return no error")
	
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		panic("configuration error, " + err.Error())
	}
	client := lambda.NewFromConfig(cfg)

	functionName := gotFunctionConfiguration.FunctionName
	data, err := ioutil.ReadFile("testdata/test-event-1.json")
	if err != nil {
		t.Error("Cant read input testdata")
		t.Error(err)
	}
	params := &lambda.InvokeInput{
		FunctionName:   functionName,
		Payload:        data,
	}
	res, err := client.Invoke(context.TODO(), params)
	assert.NilError(t, err, "Invoke should give no error")
	assert.Equal(t,"\"Done\"",string(res.Payload))
	
}

func TestLambdaGoAppCit(t *testing.T){
	if testing.Short() {
		t.Skip("skipping integration test in short mode.")
    }
	
	payload, err := citlambda.InvokeFunction(
		aws.String("LambdaGoStack"),
		aws.String("HelloHandler"),
		aws.String("testdata/test-event-1.json" ))
	assert.NilError(t, err, "Invoke should give no error")
	assert.Equal(t,"\"Done\"",*payload)
	
}
