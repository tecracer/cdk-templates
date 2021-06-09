#!/bin/bash
# Script to check cdk templates against updated 
# cdk. So deploy and destroy each template
# Usage:
#   Call from base dir
mkdir -p log
echo off
echo "Testing all GO Templates"

for i in test-alb_ec2 test-iam-user  test-lambda-simple test-vpc
do
    echo Testing $i
    date
    task $i >./log/$i.log 2>./log/$i.err 
    if [ $? -eq 0 ]
    then
        echo ✅ $i OK
    else
        echo ❌ $i NOK
    fi
    echo "##############################"
done

