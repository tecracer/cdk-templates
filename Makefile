PHONY: test help
.DEFAULT_GOAL := help


lambdastack=LambdaStack
albstack=LoadBalancerStack

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

init: ## Install after node is installed
	npm install -g aws-cdk
	npm install -g tsc

initcdk: init ## init all
	cdk init

build: ## Build tsc cdk
	npm run build

##
# Lambda

buildlambda: ## Build lambda
	cd lambda && npm run build

testlambda: buildlambda ## Test Lambda
	cd lambda && npm run test

samlocalprep: build ## Create stack for samlocal
	cdk synth LambdaStack> template.yaml

samlocalshow: ## Show Lambda function
	grep AWS::Lambda::Function template.yaml -B 1 | head -n 1 | cut -d ":" -f 1
	echo "sam local invoke MyFunction12345678 -e lambda/test/event.json"

deploy: build buildlambda ## deploy lambda
	cdk deploy $(lambdastack)

deploy-alb: ## Deploy testing application load balancer
	cdk deploy $(albstack)