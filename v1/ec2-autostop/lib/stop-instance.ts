import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { Rule, Schedule} from '@aws-cdk/aws-events';
import iam = require('@aws-cdk/aws-iam');
import { AwsTestJenkinsStack } from '../lib/aws-test-jenkins-stack';
import {EC2Stop} from '../lib/ec2-target'

export class StopInstance extends Stack {
    constructor(scope: Construct, id: string,instanceStack: AwsTestJenkinsStack,  props?: StackProps) {
        super(scope, id, props);
        const target = new EC2Stop(this,"StopTarget",instanceStack.instance);
        const myRule = new Rule(this, 'instanceStopRule', {
            // todo name dynamic
            ruleName: 'CostStopInstance'+instanceStack.instance.ref,
            description: "i start it myself but i forget to stop it",
            schedule: Schedule.cron({
                minute: '05',
                hour: '15',
                month: '*',
                weekDay: '*',
                year: '*',
            }),
            enabled: true,
            targets: [target],
            
        });

    }
}