import setuptools


with open("README.md") as fp:
    long_description = fp.read()


setuptools.setup(
    name="cognito_fargate_demo",
    version="0.0.1",

    description="An authentication demo with Cognito and a fargate container.",
    long_description=long_description,
    long_description_content_type="text/markdown",

    author="author",

    package_dir={"": "cognito_fargate_demo"},
    packages=setuptools.find_packages(where="cognito_fargate_demo"),

    install_requires=[
        "aws-cdk.core==1.27.0",
        "aws-cdk.aws-ecs-patterns==1.27.0",
        "aws-cdk.aws-cognito==1.27.0"
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
