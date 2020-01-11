# Single Instance and Test imdsv2

Goal: Test what works with imdbv2

Test: 


1. Install dependencies with `npm i`
1. Switch to you profile with `awsume $profile`. The tasks will use $AWSUME_PROFILE to determine the aws profile to use.
1. Create Instance and VPC with `task deploy`
1. Test: Connect to instance with `task connect`. 
1. disconnect
1. Enable instance metadata service v2 with `task enable-imdsv2`
1. Show whether `"HttpTokens": "required"` is now active with `task show`
1. Test: Connect to instance with `task connect`. It will not work.

For testing something else, just perform your test at the "Test" steps.
E.g. aws cli (see below).

## Stacks

There are two stacks, the vpc and the instance itself.
With deploy (`task deploy`) the first time the vpc stack will be deployed as a dependency.

The tasks `diff` and `deploy` now only work on the instance stack. If you change the name of the instacne stack, do not forget to update in `Taskvars.yml`

## EC2 instance aws cli

Install newest aws cli

1) Remove old cli
`sudo yum remove awscli`

2) Install new version of awscli
```bash
curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
unzip awscli-bundle.zip
sudo ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws
```

With the old version (here 1.16.102-1.amzn2.0.1) imdsv2 does not work.
With the new version (here aws-cli/1.16.311) imdbv2 works.

