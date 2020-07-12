# CDK Pipeline Construct


See Pipeline Documentation and  post on [aws-blog.de](https://aws-blog.de/2020/07/the-cdk-pipeline-construct.html) for details.

You have to:

1. Migrate your bootstrap bucket and template to new format
1. Copy this directory in a non git managed directory
1. Replace "111111111111" with your account
1. Re-init git
1. Create remote CodeCommit repository and push
1. Deploy the pipeline
1. Commit Changes = Deploy Changes

This directory has no "Taskfile".