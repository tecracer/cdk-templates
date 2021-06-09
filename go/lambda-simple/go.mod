module lambda-simple

go 1.16

require (
	github.com/aws/aws-cdk-go/awscdk/v2 v2.0.0-rc.7
	github.com/aws/aws-sdk-go-v2 v1.6.0
	github.com/aws/aws-sdk-go-v2/service/ssm v1.6.1 // indirect
	github.com/aws/constructs-go/constructs/v10 v10.0.5
	github.com/aws/jsii-runtime-go v1.30.0
	github.com/megaproaktiv/cit v0.1.12 // indirect
	github.com/stretchr/testify v1.7.0

	// for testing
	github.com/tidwall/gjson v1.7.4
)
