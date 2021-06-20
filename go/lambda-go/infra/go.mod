module lambdago

go 1.16

require (
	github.com/aws/aws-cdk-go/awscdk/v2 v2.0.0-rc.7
	github.com/aws/aws-sdk-go-v2 v1.6.0
	github.com/aws/aws-sdk-go-v2/config v1.3.0
	github.com/aws/aws-sdk-go-v2/service/lambda v1.3.1
	github.com/aws/constructs-go/constructs/v10 v10.0.5
	github.com/megaproaktiv/cit v0.1.13-0.20210613144206-8bf37723dcef
	github.com/pkg/errors v0.9.1 // indirect

	// for testing
	github.com/tidwall/gjson v1.7.4
	golang.org/x/sys v0.0.0-20210611083646-a4fc73990273 // indirect
	gotest.tools v2.2.0+incompatible
)
