.PHONY: test help
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


install: ## First time init
	npm -g install aws-cdk
	cdk bootstrap

init: ## Npm init /
	npm i
	## cd lambda && npm i


pre_build: ## Run build
	npm run build

build: ## 
	cdk synth

post_build: ## Diff
	cdk diff

deploy: ## Really deploy
	cdk deploy --require-approval never

remove: ## Remove
	cdk destroy --force
	
