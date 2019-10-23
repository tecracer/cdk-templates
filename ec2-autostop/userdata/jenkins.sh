#!/bin/bash
yum update –y
amazon-linux-extras enable corretto8
yum install java-1.8.0-amazon-corretto-devel -y
wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat/jenkins.repo --timeout=30
rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key
yum install jenkins -y
service jenkins start
yum -y install git docker
