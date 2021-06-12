# cdk-templates

AWS CDK is th "Cloud Development Kit" which lets you programm CloudFormation Templates.

This is a collection of templates for the cdk

## Directories

- `v1` - CDK V1
- `go` - GO CDK V2
- `python` - python CDK V2
- `typescript` - typescript CDK V2

## Tooling

We use [tasks](https://taskfile.dev/#/) for scripting.

For switching profiles [awsume](https://github.com/trek10inc/awsume) is used.

### Deploy Templates

If you use `awsume`, then the env variable `AWSUME_PROFILE` is set. If you work with different accounts its better to call the cdk cli with profile parameter.

So with awsume:

`task deploy`

Or with cdk directly:

`cdk deploy`

## Templates

Work in Progress (@megaproaktiv Juni 2021):

- Migration all CDK templates to v2

See v2 for "old" templates

## Troubleshooting

#### You get an cdk error about the syntax.

The Taskfile setting deploy with the environment variable "AWSUME_PROFILE".
This is set automatically of you use `awsume`. If not, just export your profile:

```bash
export AWSUME_PROFILE=default
```

Replace "default" with the name of your AWS profile.
