# Python CDK v2 Templates

Integration test for new CDK releases:

1) Set release in `Taskfile.yml`

```yaml
vars:
  version: v2.0.0-rc.7
  constructs: v10.0.5
```

2) Call `script/test_all.sh``

## alb-asg

- EC2 Webserver
- Application Load Balancer
- Go cit test
    - Unit template test
    - Integration ALb resource test
    - App test call to webserver