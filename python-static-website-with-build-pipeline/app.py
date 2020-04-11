#!/usr/bin/env python3

from aws_cdk import core

from infrastructure.infrastructure import StaticWebsiteStack, CertificateForCloudFrontStack


app = core.App()

HOSTED_ZONE_ID = "ZECQVEY17GSI4"
HOSTED_ZONE_NAME = "mb-trc.de"
WEBSITE_DOMAIN_NAME = "blog.mb-trc.de"

# Insert the value for the certificate stack here
CLOUDFRONT_CERTIFICATE_ARN = "arn:aws:acm:us-east-1:12312321232:certificate/4d45bfb4-19f4-4dbd-8cd6-b510f4fdf8b4"

us_east_1 = core.Environment(region="us-east-1")
eu_central_1 = core.Environment(region="eu-central-1")

certificate_stack = CertificateForCloudFrontStack(
    app,
    "certificate-stack",
    hosted_zone_id=HOSTED_ZONE_ID,
    hosted_zone_name=HOSTED_ZONE_NAME,
    website_domain_name=WEBSITE_DOMAIN_NAME,
    env=us_east_1
)



static_website_stack = StaticWebsiteStack(
    app,
    "static-website-stack",
    hosted_zone_id=HOSTED_ZONE_ID,
    hosted_zone_name=HOSTED_ZONE_NAME,
    website_domain_name=WEBSITE_DOMAIN_NAME,
    certificate_in_us_east_1_arn=CLOUDFRONT_CERTIFICATE_ARN,
    env=eu_central_1
)

static_website_stack.add_dependency(certificate_stack, reason="The certificate needs to exist in US-EAST-1!")

app.synth()
