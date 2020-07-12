#!/usr/bin/env node
import { Stage, Construct, StageProps, Stack, App } from '@aws-cdk/core';
import { CdkPipelineStack } from '../lib/cdk-pipeline-stack';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';
import { Artifact } from '@aws-cdk/aws-codepipeline'
import { CodeCommitSourceAction, CodeCommitTrigger } from '@aws-cdk/aws-codepipeline-actions'
import { Repository } from '@aws-cdk/aws-codecommit'


/**
 * Your application
 *
 * May consist of one or more Stacks
 */
class MyApplication extends Stage {
    constructor(scope: Construct, id: string, props: StageProps) {
        super(scope, id, props);
        new CdkPipelineStack(this, 'CdkPipelineStack', {
        });
    }
}

/**
 * Stack to hold the pipeline
 */
class PipelineWrapperStack extends Stack {
    constructor(scope: Construct, id: string, props: StageProps) {
        super(scope, id, props);

        const sourceArtifact = new Artifact();
        const cloudAssemblyArtifact = new Artifact();

        const repository = Repository.fromRepositoryName(this, "cdk-pipeline", "cdk-pipeline")

        const pipeline = new CdkPipeline(this, 'CiCd',
            {
                pipelineName: "PipelineWrapperStack",
                cloudAssemblyArtifact,
                sourceAction: new CodeCommitSourceAction({
                    actionName: 'CodeCommit',
                    repository,
                    branch: 'main',
                    trigger: CodeCommitTrigger.EVENTS,
                    output: sourceArtifact,

                }),
                synthAction: SimpleSynthAction.standardNpmSynth({
                    sourceArtifact,
                    cloudAssemblyArtifact,
                })
            })

        pipeline.addApplicationStage(new MyApplication(this, 'Dev', {
            env: {
                region: 'eu-central-1',
                account: '11111111111',
            }
        }))

    }
}

const app = new App();
new PipelineWrapperStack(app
    , 'PipelineWrapperStack',
    {
        env: {
            region: 'eu-central-1',
            account: '11111111111',
        },


    })

