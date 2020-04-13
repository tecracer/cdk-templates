from aws_cdk import (
    core,
    aws_lambda
)

lambda_source_dirPath = "./lambda-source"
python_source_file_name = "hellopython"
lambda_function_name = "lambda_handler"


class PythonLambdaSimpleStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # The code that defines your stack goes here
        aws_lambda.Function(self, "HelloPythonHandler",
            code=aws_lambda.Code.from_asset(lambda_source_dirPath),
            handler= python_source_file_name + "." + lambda_function_name ,
            runtime=aws_lambda.Runtime.PYTHON_3_8
        )
