package main

import (
	"testing"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/stretchr/testify/assert"

	iam "github.com/megaproaktiv/cit/services/iam"
)

// With User the Construct ID is equal the physicalID
func TestIamUserStack(t *testing.T) {
	object, err := iam.GetUser(aws.String("IamUserStack"), aws.String("student_1"))
	assert.Nil(t,err)
	assert.NotNil(t,object)
	assert.Equal(t, aws.String("/"), object.Path)
}
