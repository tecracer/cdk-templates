#!/bin/bash
# Script to check cdk templates against updated 
# cdk. So deploy and destroy each template
# Usage:
#   Call from base dir
mkdir -p log
echo off
echo "Testing all Typescript Templates"

#for i in alb_ec2 custom-resource-ses opscenter_role
for i in custom-resource-ses
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

