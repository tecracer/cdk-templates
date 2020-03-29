from aws_cdk import (core, aws_ec2 as ec2)


class AlbPyStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # Configure the `natGatewayProvider` when defining a Vpc
        nat_gateway_provider = ec2.NatProvider.instance(
            instance_type=ec2.InstanceType("t3.small")
        )
        
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
    