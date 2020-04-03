"""
This module builds the stack for the static website
"""
import aws_cdk.aws_certificatemanager as certificatemanager
import aws_cdk.aws_cloudfront as cloudfront
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

        # 4) SSL/TLS Certificate
        tls_cert = certificatemanager.DnsValidatedCertificate(
            self,
            "Certificate",
            hosted_zone=hosted_zone,
            domain_name=website_domain_name
        )

        core.CfnOutput(self, "CertificateArn", value=tls_cert.certificate_arn)


def check_us_east_1_cert(certificate_arn):

    
    assert certificate_arn.split(":")[3] == "us-east-1"

class StaticWebsiteStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, hosted_zone_id: str, hosted_zone_name: str, website_domain_name: str, certificate_in_us_east_1_arn: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # The code that defines your stack goes here

        # What are we going to need?

        # 1) An S3 Bucket
        website_bucket = s3.Bucket(self, "WebsiteBucket")


        # 3) DNS Records for CloudFront
        hosted_zone = route53.HostedZone.from_hosted_zone_attributes(
            self,
            "HostedZone",
            hosted_zone_id=hosted_zone_id,
            zone_name=hosted_zone_name
        )

        check_us_east_1_cert(certificate_in_us_east_1_arn)

        tls_cert = certificatemanager.Certificate.from_certificate_arn(self, "Certificate", certificate_arn=certificate_in_us_east_1_arn)


        # 2) A CloudFront Distribution in Front of S3

        # The Origin Access Identity is a way to allow CloudFront Access to the Website Bucket
        origin_access_identity = cloudfront.OriginAccessIdentity(self, "OriginAccessIdentity",
            comment="Allows Read-Access from CloudFront"
        )

        # We tell the website bucket to allow access from CloudFront
        website_bucket.grant_read(origin_access_identity)


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
                        cloudfront.Behavior(is_default_behavior=True)
                    ]
                )
            ],
            viewer_certificate=cloudfront.ViewerCertificate.from_acm_certificate(
                certificate=tls_cert,
                aliases=[website_domain_name]
            )
        )

        # Set the DNS Alias for CloudFront
        cloudfront_alias_record = route53.ARecord(self, "DNSAliasForCloudFront",
            zone=hosted_zone,
            target=route53.RecordTarget.from_alias(
                route53_targets.CloudFrontTarget(cloudfront_distribution)
            ),
            record_name=website_domain_name,
        )

        
        
        # 5) Code Build Project
        # 6) Code Commit Repo
        # 7) Code Pipeline
