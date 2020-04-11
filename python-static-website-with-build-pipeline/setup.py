import setuptools


with open("README.md") as fp:
    long_description = fp.read()


setuptools.setup(
    name="python_static_website_with_hugo_codepipeline_and_cloudfront",
    version="0.0.1",

    description="An empty CDK Python app",
    long_description=long_description,
    long_description_content_type="text/markdown",

    author="author",

    package_dir={"": "infrastructure"},
    packages=setuptools.find_packages(where="infrastructure"),

    install_requires=[
        "aws-cdk.core==1.32.2",
        "aws-cdk.aws-s3==1.32.2",
        "aws-cdk.aws-certificatemanager==1.32.2",
        "aws-cdk.aws-cloudfront==1.32.2",
        "aws-cdk.aws-route53-targets==1.32.2",
        "aws-cdk.aws-codecommit==1.32.2",
        "aws-cdk.aws-codebuild==1.32.2",
        "aws-cdk.aws-codepipeline==1.32.2",
        "aws-cdk.aws-codepipeline-actions==1.32.2",
    ],

    python_requires=">=3.6",

    classifiers=[
        "Development Status :: 4 - Beta",

        "Intended Audience :: Developers",

        "License :: OSI Approved :: Apache Software License",

        "Programming Language :: JavaScript",
        "Programming Language :: Python :: 3 :: Only",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",

        "Topic :: Software Development :: Code Generators",
        "Topic :: Utilities",

        "Typing :: Typed",
    ],
)
