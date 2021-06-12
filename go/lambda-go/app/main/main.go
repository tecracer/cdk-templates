package main

import (
	"context"
	"fmt"

	"reporting"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
)

// HandleRequest S3 Event
func handler(ctx context.Context, s3Event events.S3Event) (string, error) {
	fmt.Println("Hello")
	return "Done", nil

}

func main() {

	lambda.Start(handler)

}
