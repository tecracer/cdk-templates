# Jenkins Test environment AWS

## Install server

At first, create a ssh key "mykey".

Install with `cdk deploy`.
The jenkins repos are slow an have timeouts, so probably you have to install `userdata/jenkins.sh` manually

## Get inital password

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

## Sources

https://d1.awsstatic.com/Projects/P5505030/aws-project_Jenkins-build-server.pdf
