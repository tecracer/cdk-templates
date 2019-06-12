.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

synth: ## Generate CloudFormation
	cdk synth >templates/opscenterrole.template

init-taskcat: ## Install taskcat
	pip3 install taskcat


test: ## Test Cloudformation
	taskcat -c ./ci/taskcat.yml --exclude node_modules --exclude lib --exclude lib

report: ## Test Report anzeigen
	open ./taskcat_outputs/index.html
