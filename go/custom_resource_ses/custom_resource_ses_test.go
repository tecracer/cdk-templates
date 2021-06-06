package main

import (
	"encoding/json"
	"testing"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/stretchr/testify/assert"
	"github.com/tidwall/gjson"
)

func TestCustomResourceSesStack(t *testing.T) {
	// GIVEN
	app := awscdk.NewApp(nil)

	// WHEN
	stack := NewCustomResourceSesStack(app, "MyStack", nil)

	// THEN
	bytes, err := json.Marshal(app.Synth(nil).GetStackArtifact(stack.ArtifactId()).Template())
	if err != nil {
		t.Error(err)
	}
	expectedCreateCfn:="{\"action\":\"verifyEmailIdentity\",\"parameters\":{\"EmailAddress\":\"info@megaproaktiv.de\"},\"physicalResourceId\":{\"id\":\"Identity\"},\"service\":\"SES\"}"
	template := gjson.ParseBytes(bytes)
	actualCreateCfn := template.Get("Resources.Identity2D60E2CC.Properties.Create").String()
	assert.Equal(t, expectedCreateCfn, actualCreateCfn)
}
