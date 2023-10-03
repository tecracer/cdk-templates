package embedding

import (
	"github.com/aws/aws-cdk-go/awscdk/v2"
	ec2 "github.com/aws/aws-cdk-go/awscdk/v2/awsec2"
	rds "github.com/aws/aws-cdk-go/awscdk/v2/awsrds"
	secrectsmanager "github.com/aws/aws-cdk-go/awscdk/v2/awssecretsmanager"
	ssm "github.com/aws/aws-cdk-go/awscdk/v2/awsssm"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
)

type AuroraStackProps struct {
	StackProps awscdk.StackProps
}

func NewAuroraStack(scope constructs.Construct, id string, props *AuroraStackProps) awscdk.Stack {
	var sprops awscdk.StackProps
	if props != nil {
		sprops = props.StackProps
	}
	stack := awscdk.NewStack(scope, &id, &sprops)
	this := stack
	dataBaseUserName := "james"

	vpcid := ssm.StringParameter_ValueFromLookup(this, aws.String("/network/basevpc"))

	vpc := ec2.Vpc_FromLookup(stack, aws.String("basevpc"),
		&ec2.VpcLookupOptions{
			IsDefault: aws.Bool(false),
			VpcId:     vpcid,
		})

	// Create a secret to store the database credentials
	dbCredentials := secrectsmanager.NewSecret(stack, jsii.String("Secret"), &secrectsmanager.SecretProps{
		SecretName: aws.String("aurora-credentials"),
		GenerateSecretString: &secrectsmanager.SecretStringGenerator{
			SecretStringTemplate: aws.String(`{"username": "james"}`),
			GenerateStringKey:    aws.String("password"),
			ExcludePunctuation:   aws.Bool(true),
		},
	})

	// DB Config for autora cluster
	// dbConfig := &aurora.CfnDBCluster_DatabaseProperties{
	// 	DatabaseName:  aws.String("mydb"),
	// 	Engine:        aws.String("aurora-postgresql"),
	// 	EngineVersion: aws.String("15.3"),
	// 	// get user/password from dbCredentials
	// 	masterUsername:     dbCredentials.SecretValueFromJson("username"),
	// 	masterUserPassword: dbCredentials.SecretValueFromJson("password"),
	// }

	rdsCluster := rds.NewDatabaseCluster(this, aws.String("vectordb"), &rds.DatabaseClusterProps{
		Engine: rds.DatabaseClusterEngine_AuroraPostgres(
			&rds.AuroraPostgresClusterEngineProps{
				Version: rds.AuroraPostgresEngineVersion_VER_15_3(),
			},
		),
		Writer: rds.ClusterInstance_Provisioned(aws.String("writer"),
			&rds.ProvisionedClusterInstanceProps{
				InstanceType: ec2.InstanceType_Of(ec2.InstanceClass_BURSTABLE3, ec2.InstanceSize_MEDIUM),
			},
		),
		Readers: &[]rds.IClusterInstance{
			rds.ClusterInstance_Provisioned(aws.String("reader"),
				&rds.ProvisionedClusterInstanceProps{
					InstanceType: ec2.InstanceType_Of(ec2.InstanceClass_BURSTABLE3, ec2.InstanceSize_MEDIUM),
				}),
		},
		ClusterIdentifier:   aws.String("vectordb"),
		Credentials:         rds.Credentials_FromSecret(dbCredentials, &dataBaseUserName),
		DefaultDatabaseName: aws.String("vectrodb"),
		Vpc:                 vpc,
		VpcSubnets: &ec2.SubnetSelection{
			SubnetType: ec2.SubnetType_PUBLIC,
		},
	})
	awscdk.NewCfnOutput(this, aws.String("rdscuster"), &awscdk.CfnOutputProps{
		Value: rdsCluster.ClusterEndpoint().Hostname(),
	})
	return stack
}
