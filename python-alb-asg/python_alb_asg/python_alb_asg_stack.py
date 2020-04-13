from aws_cdk import (core)
import aws_cdk.aws_ec2 as ec2
import aws_cdk.aws_iam as iam
import aws_cdk.aws_elasticloadbalancingv2 as elbv2
import aws_cdk.aws_autoscaling as autoscaling


class PythonAlbAsgStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # Setup ALB an AutoScalingGroup with fixed capacity (no scaling event)
        # a VPC with 2 public + 2 private Subnets, 1 NATinstance spread over 2 AZs
        # ASG-Instances are configured with an Instance-Role to use SSM and a Web-Server installed through user-data

        # Configure the `natGatewayProvider` when defining a Vpc
        nat_gateway_provider = ec2.NatProvider.instance(
            instance_type=ec2.InstanceType("t3.small")
        )
        # Build a VPC plus Subnet Configuration, Routing tables and relevant routes
        vpc = ec2.Vpc(self, "VPC",
            cidr="10.0.0.0/16",
            max_azs=2,
            nat_gateway_provider=nat_gateway_provider,

            # The 'natGateways' parameter now controls the number of NAT instances
            nat_gateways=1,
            subnet_configuration=[
                ec2.SubnetConfiguration(
                    # 'subnetType' controls Internet access, as described above.
                    subnet_type=ec2.SubnetType.PUBLIC,
                    name="Public",
                    cidr_mask=24
                ), 
                ec2.SubnetConfiguration(
                    subnet_type=ec2.SubnetType.PRIVATE,                    
                    name="Private",
                    cidr_mask=24,
                )
            ]    
        )

        # Create the load balancer in a VPC. 'internetFacing' is 'false'
        # by default, which creates an internal load balancer.
        lb = elbv2.ApplicationLoadBalancer(self, "LB",
            vpc=vpc,
            internet_facing=True
        )

        # Add a listener and open up the load balancer's security group
        # to the world.
        listener = lb.add_listener("Listener",
            port=80,
            open=True
        )

        # Create ServiceRole for EC2 instances; enable SSM usage
        EC2InstanceRole = iam.Role(self, "Role",
            assumed_by=iam.ServicePrincipal("ec2.amazonaws.com"),
            managed_policies=[iam.ManagedPolicy.from_aws_managed_policy_name("AmazonSSMManagedInstanceCore")],
            description="This is a custom role for assuming SSM role"
        )

        # Create an AutoScaling group; define InstanceRole and specify InstanceType
        auto_scaling_group = autoscaling.AutoScalingGroup(self, "ASG",
            vpc=vpc,
            min_capacity=2,
            max_capacity=2,
            role=EC2InstanceRole,
            instance_type=ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
            machine_image=ec2.AmazonLinuxImage(
                generation=ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
                edition=ec2.AmazonLinuxEdition.STANDARD,
                virtualization=ec2.AmazonLinuxVirt.HVM,
                storage=ec2.AmazonLinuxStorage.GENERAL_PURPOSE
            )
        )

        # add the AutoScaling group as target to the listener.
        listener.add_targets("ApplicationFleet",
            port=80,
            targets=[auto_scaling_group]
        )

        # read userdata script to install a simple WebServer
        # on the ASG-Instances
        with open('./userdata/webserver.sh', 'r') as myfile:
            userdata_script = myfile.read()

        auto_scaling_group.add_user_data(userdata_script)       
