from aws_cdk import (core)
import aws_cdk.aws_ec2 as ec2
import aws_cdk.aws_iam as iam
import aws_cdk.aws_elasticloadbalancingv2 as elbv2
import aws_cdk.aws_autoscaling as autoscaling


class PythonAlbAsgStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # Setup ALB in VPC with 2 pub + 2 priv Subnet and 1 NATinstance spread over 2 AZs

        # Configure the `natGatewayProvider` when defining a Vpc
        nat_gateway_provider = ec2.NatProvider.instance(
            instance_type=ec2.InstanceType("t3.small")
        )
        # Build a VPC plus Subnet Configuration
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

        # Create an AutoScaling group and add it as a load balancing
        # target to the listener.
        auto_scaling_group = autoscaling.AutoScalingGroup(self, "ASG",
            vpc=vpc,
            min_capacity=2,
            max_capacity=2,
            instance_type=ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
            machine_image=ec2.AmazonLinuxImage(
                generation=ec2.AmazonLinuxGeneration.AMAZON_LINUX,
                edition=ec2.AmazonLinuxEdition.STANDARD,
                virtualization=ec2.AmazonLinuxVirt.HVM,
                storage=ec2.AmazonLinuxStorage.GENERAL_PURPOSE
            )
        )

        # read userdata script
        with open('./userdata/webserver.sh', 'r') as myfile:
            userdata_script = myfile.read()

        auto_scaling_group.add_user_data(userdata_script)

        listener.add_targets("ApplicationFleet",
            port=80,
            targets=[auto_scaling_group],
            health_check={
                "port": '80'
            }
        )        
