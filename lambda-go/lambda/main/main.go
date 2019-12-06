package main

import (
	"context"
	"fmt"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-lambda-go/events"
	"os"
)


func init(){
}

// MyEvent Struct for S3 event
type MyEvent struct {
	Name string `json:"name"`
}

// HandleRequest S3 Event
func handler(ctx context.Context, s3Event events.S3Event) {

	// See https://github.com/aws/aws-lambda-go/tree/master/events
	// Handle only one event
	s3input := s3Event.Records[0].S3
	fmt.Printf("Bucket = %s, Key = %s \n", s3input.Bucket.Name, 
	s3input.Object.Key)

}


func main() {

	lambda.Start(handler)

}


// CreateDirIfNotExist mkdir
func CreateDirIfNotExist(dir string) {
	if _, err := os.Stat(dir); os.IsNotExist(err) {
			err = os.MkdirAll(dir, 0755)
			if err != nil {
					panic(err)
			}
	}
}
