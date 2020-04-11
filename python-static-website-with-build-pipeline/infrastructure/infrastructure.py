"""
This module builds the stack for the static website
"""
import aws_cdk.aws_certificatemanager as certificatemanager
import aws_cdk.aws_cloudfront as cloudfront
import aws_cdk.aws_codebuild as codebuild
import aws_cdk.aws_codecommit as codecommit
import aws_cdk.aws_codepipeline as codepipeline
import aws_cdk.aws_codepipeline_actions as codepipeline_actions
import aws_cdk.aws_route53 as route53
import aws_cdk.aws_route53_targets as route53_targets
import aws_cdk.aws_s3 as s3

from aws_cdk import core


class CertificateForCloudFrontStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, hosted_zone_id: str, hosted_zone_name: str, website_domain_name: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        hosted_zone = route53.HostedZone.from_hosted_zone_attributes(
            self,
            "HostedZone",
            hosted_zone_id=hosted_zone_id,
            zone_name=hosted_zone_name
        )

        # SSL/TLS Certificate
        tls_cert = certificatemanager.DnsValidatedCertificate(
            self,
            "Certificate",
            hosted_zone=hosted_zone,
            domain_name=website_domain_name
        )

        core.CfnOutput(self, "CertificateArn", value=tls_cert.certificate_arn)


def check_us_east_1_cert(certificate_arn: str):
    """
    Asserts that we get a certificate for the us-east-1 region.

    :param certificate_arn: ARN of the certificate to check.
    """

    
    assert certificate_arn.split(":")[3] == "us-east-1", "We need a certificate in us-east-1 for CloudFront!"

class StaticWebsiteStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, hosted_zone_id: str, hosted_zone_name: str, website_domain_name: str, certificate_in_us_east_1_arn: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # Raise an exception if we get a certificate that doesn't live in us-east-1
        check_us_east_1_cert(certificate_in_us_east_1_arn)

        # The S3 Bucket that will store our website
        website_bucket = s3.Bucket(self, "WebsiteBucket")

        # The Origin Access Identity is a way to allow CloudFront Access to the Website Bucket
        origin_access_identity = cloudfront.OriginAccessIdentity(self, "OriginAccessIdentity",
            comment="Allows Read-Access from CloudFront"
        )

        # We tell the website bucket to allow access from CloudFront
        website_bucket.grant_read(origin_access_identity)


        # Import the cert from the arn we get as a parameter
        tls_cert = certificatemanager.Certificate.from_certificate_arn(self, "Certificate", certificate_arn=certificate_in_us_east_1_arn)

        # We set up the CloudFront Distribution with the S3 Bucket as the origin and our certificate
        cloudfront_distribution = cloudfront.CloudFrontWebDistribution(
            self, "WebsiteDistribution",
            origin_configs=[
                cloudfront.SourceConfiguration(
                    s3_origin_source=cloudfront.S3OriginConfig(
                        s3_bucket_source=website_bucket,
                        origin_access_identity=origin_access_identity
                    ),
                    behaviors=[
                        cloudfront.Behavior(
                            is_default_behavior=True,
                            default_ttl=core.Duration.hours(1)
                        )
                    ]
                )
            ],
            viewer_certificate=cloudfront.ViewerCertificate.from_acm_certificate(
                certificate=tls_cert,
                aliases=[website_domain_name]
            )
        )

        # Set the DNS Alias for CloudFront
        hosted_zone = route53.HostedZone.from_hosted_zone_attributes(
            self,
            "HostedZone",
            hosted_zone_id=hosted_zone_id,
            zone_name=hosted_zone_name
        )

        cloudfront_alias_record = route53.ARecord(self, "DNSAliasForCloudFront",
            zone=hosted_zone,
            target=route53.RecordTarget.from_alias(
                route53_targets.CloudFrontTarget(cloudfront_distribution)
            ),
            record_name=website_domain_name,
        )

        # Repo for the website
        repository = codecommit.Repository(
            self, "Repository",
            repository_name=website_domain_name,
            description=f"Repository for the website {website_domain_name}"
        )

        website_build_project = codebuild.PipelineProject(self, "WebsiteBuild",
            build_spec=codebuild.BuildSpec.from_source_filename(
                "buildspec.yml"
            ),
            environment=codebuild.BuildEnvironment(
                build_image=codebuild.LinuxBuildImage.STANDARD_4_0
            ),
            environment_variables={
                "baseurl": codebuild.BuildEnvironmentVariable(value=f"https://{website_domain_name}/"),
                "bucket": codebuild.BuildEnvironmentVariable(value=website_bucket.bucket_name)
            }
        )
        website_bucket.grant_read_write(website_build_project.grant_principal)

        source_output = codepipeline.Artifact()

        website_build_pipeline = codepipeline.Pipeline(self, "WebsiteBuildPipeline",
            stages=[

                # Check Out the Code From the Repo
                codepipeline.StageProps(
                    stage_name="Source",
                    actions=[
                        codepipeline_actions.CodeCommitSourceAction(
                            action_name="CheckoutCode",
                            repository=repository,
                            output=source_output
                        )
                    ]
                ),

                # Build and deploy the Website to S3 (this uses the sync command with the delete option, which the codebuild action to deploy to S3 doesn't support)
                codepipeline.StageProps(
                    stage_name="BuildAndDeploy",
                    actions=[
                        codepipeline_actions.CodeBuildAction(
                            action_name="BuildAndDeployWebsite",
                            project=website_build_project,
                            input=source_output
                        )
                    ]
                )
            ]
        )

        # Display the Repo Clone URLs as the Stack Output
        core.CfnOutput(self, "RepositoryCloneUrlSSH", value=repository.repository_clone_url_ssh)
        core.CfnOutput(self, "RepositoryCloneUrlHTTPS", value=repository.repository_clone_url_http)

        # Display the website URL as the stack output
        core.CfnOutput(self, "WebsiteUrl", value=f"https://{website_domain_name}/")