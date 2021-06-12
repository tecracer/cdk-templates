# CDK Lambda in GO with Lambda GO Function


The  Lambda app *must not* reside in a subdirectory from the CDK app.

This is because only the main directory of a GO module has a `go.mod` file with the module settings.
And in each subdirectory only *one* package and its `_test` packages can be. 
The package name has nothing to do with the subdirectory name.

So to separate the GO CDK app from the Lambda app, there have to be two different directories.

Directory | purpose
---|---
app | the Lambda function
infra | the CDK app to generate infrastructure
dist | the compiled Lambda function




