import os
import urllib.parse

from aws_cdk import core

import aws_cdk.aws_certificatemanager as certificatemanager
import aws_cdk.aws_cognito as cognito
import aws_cdk.aws_ec2 as ec2
import aws_cdk.aws_ecs as ecs
import aws_cdk.aws_ecs_patterns as ecs_patterns
import aws_cdk.aws_ecr_assets as ecr_assets
import aws_cdk.aws_elasticloadbalancingv2 as elb
import aws_cdk.aws_route53 as route53


APP_DNS_NAME = "cognito-fargate-demo.mb-trc.de"
COGNITO_CUSTOM_DOMAIN = "alb-fargate-auth-demo-mbtrc"
HOSTED_ZONE_ID = "ZECQVEY17GSI4"
HOSTED_ZONE_NAME = "mb-trc.de"


class CognitoFargateDemoStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # Get the hosted Zone and create a certificate for our domain

        hosted_zone = route53.HostedZone.from_hosted_zone_attributes(
            self,
            "HostedZone",
            hosted_zone_id=HOSTED_ZONE_ID,
            zone_name=HOSTED_ZONE_NAME
        )

        cert = certificatemanager.DnsValidatedCertificate(
            self,
            "Certificate",
            hosted_zone=hosted_zone,
            domain_name=APP_DNS_NAME
        )

        # Set up a new VPC

        vpc = ec2.Vpc(
            self,
            "FargateDemoVpc",
            max_azs=2
        )

        # Set up an ECS Cluster for fargate

        cluster = ecs.Cluster(
            self,
            "FargateCluster",
            vpc=vpc
        )

        # Configure the user pool and related entities for authentication

        user_pool = cognito.UserPool(
            self,
            "UserPool",
            self_sign_up_enabled=True,
            user_pool_name="FargateDemoUserPool",

        )

        user_pool_custom_domain = cognito.CfnUserPoolDomain(
            self,
            "CustomDomain",
            domain=COGNITO_CUSTOM_DOMAIN,
            user_pool_id=user_pool.user_pool_id
        )

        user_pool_client = cognito.UserPoolClient(
            self,
            "AppClient",
            user_pool=user_pool,
            user_pool_client_name="AlbAuthentication",
            generate_secret=True
        )

        # Set the attributes on the user pool client that can't be updated via the construct
        user_pool_client_cf: cognito.CfnUserPoolClient = user_pool_client.node.default_child
        user_pool_client_cf.allowed_o_auth_flows = ["code"]
        user_pool_client_cf.allowed_o_auth_scopes = ["openid"]
        user_pool_client_cf.callback_ur_ls = [
            f"https://{APP_DNS_NAME}/oauth2/idpresponse",
            f"https://{APP_DNS_NAME}"
        ]
        user_pool_client_cf.default_redirect_uri = f"https://{APP_DNS_NAME}/oauth2/idpresponse"
        user_pool_client_cf.logout_ur_ls = [
            f"https://{APP_DNS_NAME}/logout",
            f"https://{APP_DNS_NAME}/"
        ]
        user_pool_client_cf.supported_identity_providers = [
            # This is where you'd add external identity providers as well.
            "COGNITO"
        ]
        user_pool_client_cf.allowed_o_auth_flows_user_pool_client = True

        # Define the Docker Image for our container (the CDK will do the build and push for us!)
        docker_image = ecr_assets.DockerImageAsset(
            self,
            "JwtApp",
            directory=os.path.join(os.path.dirname(__file__), "..", "src")
        )

        user_pool_domain = f"{user_pool_custom_domain.domain}.auth.{self.region}.amazoncognito.com"

        # Define the fargate service + ALB

        fargate_service = ecs_patterns.ApplicationLoadBalancedFargateService(
            self,
            "FargateService",
            cluster=cluster,
            certificate=cert,
            domain_name=f"{APP_DNS_NAME}",
            domain_zone=hosted_zone,
            task_image_options={
                "image": ecs.ContainerImage.from_docker_image_asset(docker_image),
                "environment": {
                    "PORT": "80",
                    "LOGOUT_URL": f"https://{user_pool_domain}/logout?"
                                + f"client_id={user_pool_client.user_pool_client_id}&"
                                + f"redirect_uri={ urllib.parse.quote(f'https://{APP_DNS_NAME}')}&"
                                + f"response_type=code&state=STATE&scope=openid"
                }
            }
        )

        # Add an additional HTTPS egress rule to the Load Balancers security group to talk to Cognito
        lb_security_group = fargate_service.load_balancer.connections.security_groups[0]

        lb_security_group.add_egress_rule(
            peer=ec2.Peer.any_ipv4(),
            connection=ec2.Port(
                protocol=ec2.Protocol.TCP,
                string_representation="443",
                from_port=443,
                to_port=443
            ),
            description="Outbound HTTPS traffic to get to Cognito"
        )

        # Allow 10 seconds for in flight requests before termination, the default of 5 minutes is much too high.
        fargate_service.target_group.set_attribute(key="deregistration_delay.timeout_seconds", value="10")

        # Enable authentication on the Load Balancer
        alb_listener: elb.CfnListener = fargate_service.listener.node.default_child
        
        elb.CfnListenerRule(
            self,
            "AuthenticateRule",
            actions=[
                {
                    "type": "authenticate-cognito",
                    "authenticateCognitoConfig": elb.CfnListenerRule.AuthenticateCognitoConfigProperty(
                        user_pool_arn=user_pool.user_pool_arn,
                        user_pool_client_id=user_pool_client.user_pool_client_id,
                        user_pool_domain=user_pool_custom_domain.domain
                    ),
                    "order": 1
                },
                {
                    "type": "forward",
                    "order": 10,
                    "targetGroupArn": fargate_service.target_group.target_group_arn
                }
            ],
            conditions=[
                {
                    "field": "host-header",
                    "hostHeaderConfig": {
                        "values": [
                            f"{APP_DNS_NAME}"
                        ]
                    }
                }
            ],
            # Reference the Listener ARN
            listener_arn=alb_listener.ref,
            priority= 1000
        )

# TODO: Edit defualt rule, this shouldn't redirect to the target group directly!
