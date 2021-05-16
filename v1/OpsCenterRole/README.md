# IAM Role

This exampe creates a role for OpsCenter

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## taskcat

Using taskcat to test the cloudformation template.

Keep in mind that cdk generates for a *specific* region. 
This taskcat test just takes the template which was created for the current region and deploys it to `eu-central-1` and 
`eu-west-1`. This would not work with e.g. EC2 instances because of region specific AMIS. This is a problem which cdk resolves by generation AMI references to the current region.

### test with taskcat

`make test`

```bash
make test           
cdk synth >templates/opscenterrole.template
taskcat -c ./ci/taskcat.yml --exclude node_modules --exclude lib --exclude lib
 _            _             _   
| |_ __ _ ___| | _____ __ _| |_ 
| __/ _` / __| |/ / __/ _` | __|
| || (_| \__ \   < (_| (_| | |_ 
 \__\__,_|___/_|\_\___\__,_|\__|
                                

/Users/silberkopf/.pyenv/versions/3.7.3/lib/python3.7/site-packages/botocore/vendored/requests/api.py:67: DeprecationWarning: You are using the get() function from 'botocore.vendored.requests'.  This is not a public API in botocore and will be removed in the future. Additionally, this version of requests is out of date.  We recommend you install the requests package, 'import requests' directly, and use the requests.get() function instead.
  DeprecationWarning
version 0.8.36


[taskcat] :AWS AccountNumber:    [123456789012]
[taskcat] :Authenticated via:    [environment]


[taskcat] :Reading Config from: ./ci/taskcat.yml
[taskcat] |Queing test => scenario-1 
[ERROR  ] :Lint detected issues for test scenario-1 on template /Users/silberkopf/Documents/Projekte/cdk/cdk-templates/OpsCenterRole/templates/opscenterrole.template:
[ERROR  ] :    line 23 [E2507] [Check if IAM Policies are properly configured] (IAM Resource Policy statement shouldn't have Principal or
                       NotPrincipal)
[ERROR  ] :    line 23 [E2507] [Check if IAM Policies are properly configured] (IAM Policy statement missing Resource or NotResource)
[INFO   ] :Creating bucket taskcat-tag-opscenterrole-1cab67ca in eu-central-1
[INFO   ] :Staging Bucket => [taskcat-tag-opscenterrole-1cab67ca]
[INFO   ] :Enforcing sigv4 requests for bucket taskcat-tag-opscenterrole-1cab67ca
[S3: -> ] s3://taskcat-tag-opscenterrole-1cab67ca/OpsCenterRole/Makefile
# ...
```

### taskcat report

`make report` opens a report (works on mac)

Opens `OpsCenterRole/taskcat_outputs/index.html``


