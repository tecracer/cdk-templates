#!/bin/bash
# Script to check cdk templates against updated 
# cdk. So deploy and destroy each template
# Usage:
#   Call from base dir
npm install cdk -g
mkdir -p log
echo off
echo "Testing all"
for i in alb-update ec2-autostop lambda-apigw lambda-schedule lambda-simple OpsCenterRole r53 vpc-bastion codepipeline iam-user
do
    echo Testing $i
    date
    cd $i 
    task edge-of-tomorrow >../log/$i.log 2>../log/$i.err 
    if [ $? -eq 0 ]
    then
        echo ✅ $i OK
    else
        echo ❌ $i NOK
    fi
    cd ..
    echo "##############################"
done
