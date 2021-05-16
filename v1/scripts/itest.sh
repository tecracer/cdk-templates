#!/bin/bash
# Script to check cdk templates against updated 
# cdk. So deploy and destroy each template
# Usage:
#   Call from base dir
npm install cdk -g
mkdir -p log
echo off
echo "Testing all without bootstrap"
 for i in alb-update ec2-autostop OpsCenterRole r53 transitgateway vpc-bastion codepipeline iam-user selfEditing
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
echo "Testing all with bootstrap"
 for i in  aws-custom-resource-ses  ec2-instanceconnect lambda-apigw lambda-schedule lambda-simple lambda-go 
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
