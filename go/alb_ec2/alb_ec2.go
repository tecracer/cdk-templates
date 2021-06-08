package main

import (
	"io/ioutil"
	"os"
	// CDK
	awscdk "github.com/aws/aws-cdk-go/awscdk/v2"
	autoscaling "github.com/aws/aws-cdk-go/awscdk/v2/awsautoscaling"
	constructs "github.com/aws/constructs-go/constructs/v10"
	ec2 "github.com/aws/aws-cdk-go/awscdk/v2/awsec2"
	elasticloadbalancingv2 "github.com/aws/aws-cdk-go/awscdk/v2/awselasticloadbalancingv2"
	iam "github.com/aws/aws-cdk-go/awscdk/v2/awsiam"
	ssm "github.com/aws/aws-cdk-go/awscdk/v2/awsssm"
	// SDK
	aws "github.com/aws/aws-sdk-go-v2/aws"
)

type AlbEC2StackProps struct {
	awscdk.StackProps
}



func NewAlbEC2Stack(scope constructs.Construct, id string, props *AlbEC2StackProps) awscdk.Stack {
	var sprops awscdk.StackProps
	if props != nil {
		sprops = props.StackProps
	}
	stack := awscdk.NewStack(scope, &id, &sprops)
	stage := scope.Node().TryGetContext(aws.String("stage"))

	if stage == "" {
		stage = "dev"
	}

	// The code that defines your stack goes here
	// The code that defines your stack goes here
	myVpc := ec2.NewVpc(stack, aws.String("MyVpc"),
		&ec2.VpcProps{
			Cidr: aws.String("10.0.0.0/16"),
		},
	)

	// This is unsecure
	ssmPolicy := iam.ManagedPolicy_FromAwsManagedPolicyName(aws.String("service-role/AmazonSSMManagedInstanceCore"));

	instanceRole := iam.NewRole(stack, aws.String("webinstancerole"),
		&iam.RoleProps{
			AssumedBy:           iam.NewServicePrincipal(aws.String("ec2.amazonaws.com"), nil),
			Description:         aws.String("Instance Role"),
			ManagedPolicies:     &[]iam.IManagedPolicy{ ssmPolicy},
		},
	)

	asg := autoscaling.NewAutoScalingGroup(stack, aws.String("ASG"),
		&autoscaling.AutoScalingGroupProps{
			AutoScalingGroupName:             aws.String("autoscalingGroupCDKDEMO"),			
			MaxCapacity:                      aws.Float64(2),		
			InstanceType:                     ec2.InstanceType_Of(ec2.InstanceClass_BURSTABLE2, ec2.InstanceSize_MICRO),
			MachineImage:                     ec2.MachineImage_LatestAmazonLinux(&ec2.AmazonLinuxImageProps{
				Generation:     ec2.AmazonLinuxGeneration_AMAZON_LINUX_2,
			}),
			Vpc:                              myVpc,
			Role:                             instanceRole,
		})

	userdataFileName := "userdata/webserver-infratest.sh"
	if stage == "prod"{
		userdataFileName="userdata/webserver-production.sh"
	}
	data, err := ioutil.ReadFile(userdataFileName)
	if err != nil {
		panic("File reading error")
	}
	asg.AddUserData(aws.String(string(data)))	

	lb := elasticloadbalancingv2.NewApplicationLoadBalancer(stack, aws.String("LB"),
	&elasticloadbalancingv2.ApplicationLoadBalancerProps{
		Vpc:                myVpc,
		InternetFacing:     aws.Bool(true),
		LoadBalancerName:   aws.String("ALBGODEMO"),
	},
	)

	listener := lb.AddListener(aws.String("Listener"), 
		&elasticloadbalancingv2.BaseApplicationListenerProps{
			Port:                aws.Float64(80),
		}		,
	)

	listener.AddTargets(aws.String("Target"), 
	&elasticloadbalancingv2.AddApplicationTargetsProps{
		Port:                     aws.Float64(80),
		Targets:                  &[]elasticloadbalancingv2.IApplicationLoadBalancerTarget{asg},
	},
	)

	listener.Connections().AllowDefaultPortFromAnyIpv4(aws.String("Open4all"))

	asg.ScaleOnRequestCount(aws.String("ModestLoad"), &autoscaling.RequestCountScalingProps{
		TargetRequestsPerMinute: aws.Float64(1),
	})

	ssm.NewStringParameter(stack, aws.String("govpc"),
		&ssm.StringParameterProps{
			Description:    aws.String("alb"),
			ParameterName:  aws.String("/cdk-templates/go/alb_ec2"),
			StringValue:    lb.LoadBalancerDnsName(),
		},
	)

	return stack
}

func main() {
	app := awscdk.NewApp(nil)

	NewAlbEC2Stack(app, "AlbInstStack", &AlbEC2StackProps{
		awscdk.StackProps{
			Env: env(),
		},
	})

	app.Synth(nil)
}

// env determines the AWS environment (account+region) in which our stack is to
// be deployed. For more information see: https://docs.aws.amazon.com/cdk/latest/guide/environments.html
func env() *awscdk.Environment {
	return &awscdk.Environment{
	 Account: aws.String(os.Getenv("CDK_DEFAULT_ACCOUNT")),
	 Region:  aws.String(os.Getenv("CDK_DEFAULT_REGION")),
	}
}
