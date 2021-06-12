# VPC - getting started example for go

The VPCid is stored in a SSM parameter for the integration tests.

![Overview](doc/vpc.png)

## Integration Test with terratest

Fetch the vpc id from ssm.

```go
vpcId := awstest.GetParameter(t,region,"/cdk-templates/go/vpc")
awstest.GetVpcById(t, vpcId,region)
```    

## Integration Test with cit

Get GO SDK vpc type with stack and construct name:

```go
vpc,err := ec2.GetVpc(aws.String("VpcStack"), aws.String("MyVpc"))
```

## Stack / Unit Test 

Look for values in the generated json.

```go
	cidrrange := template.Get("Resources.MyVpcF9F0CA6F.Properties.CidrBlock").String()
	assert.Equal(t, "10.0.0.0/16", cidrrange, "Cidr Range should be /16")
``    