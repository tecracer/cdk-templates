import { Arn,ArnComponents, Construct, Stack} from '@aws-cdk/core';
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import ec2 = require('@aws-cdk/aws-ec2');
import { Role, Policy, PolicyDocument } from '@aws-cdk/aws-iam';

/**
 * Customize the EC2 Topic Event Target
 */
export interface EC2StopFunctionProps {
    /**
     * The event to send to the EC2
     *
     * @default the entire CloudWatch event
     */
    readonly event?: events.RuleTargetInput;
}

/**
 * Use an AWS EC2 stop as an event rule target.
 */
export class EC2Stop implements events.IRuleTarget {
    instance: ec2.CfnInstance;
    role: Role;
    // Input is InstanceId
    constructor(scope: Construct, id: string,instance: ec2.CfnInstance) {
        this.instance = instance;
        const policyDoc = new PolicyDocument();
        const statement = new iam.PolicyStatement();
        statement.addActions("ec2:RebootInstances",
            "ec2:StopInstances");
        const arn = Arn.format(
            {
                resource: "instance",
                service: "ec2",
                resourceName: instance.ref,
            }, 
            instance.stack);
        statement.addResources(arn);
        policyDoc.addStatements( statement);
        this.role = new Role(scope, 'stopEventRole',
        {
            assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
            inlinePolicies: {
                 canStopThis: policyDoc,
            }
        })
    }

    /**
     * Returns a RuleTarget that can be used to trigger ec2 Stop
     * result from a CloudWatch event.
     */
    public bind(rule: events.IRule, _id?: string): events.RuleTargetConfig {
        return {
            id: '',
            arn: "arn:aws:events:eu-central-1:669453403305:target/stop-instance",
            targetResource: this.instance,
            input:  events.RuleTargetInput.fromText(this.instance.ref),
            role: this.role,
        };
    }
}