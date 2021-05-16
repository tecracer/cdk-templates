# TypeScript CDK Examples

Test with script

```bash
script/integration_test.sh
```

This calls an "task edge-of-tomorrow" for each example.

If possible, integration test (check whether the resource is really created) is included.

The Version of the cdk is defined in each taskfile:

```yaml
vars:
  version: v2.0.0-rc.3
  constructs: 10.0.0
```

So with a new version:

1) Update specific taskfile
2) run test


## alb-ec2

- Auto generate AMI for region and OS type
- Attach AWS managed policy to role
- EC2 Userdata in external file
- Attach Role for SSM Session Manager to instance in ASG

## custom-resource-ses

- Custom lambda resource
- calling AWS API from custom resource

## opscenter_role

- Role, Policy and service principal