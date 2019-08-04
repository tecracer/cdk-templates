import cdk = require('@aws-cdk/core');
import { BuildSpec, PipelineProject, LinuxBuildImage, ComputeType } from '@aws-cdk/aws-codebuild'
import { Repository } from '@aws-cdk/aws-codecommit'
import { Pipeline, Artifact } from '@aws-cdk/aws-codepipeline';
import {CodeBuildAction,CodeBuildActionProps,CodeCommitSourceAction,CodeCommitTrigger } from '@aws-cdk/aws-codepipeline-actions';
import iam = require('@aws-cdk/aws-iam');

//import { Bucket } from '@aws-cdk/aws-s3';

export class CodepipelineStack extends cdk.Stack {
  projectName: string;
  pipeline: Pipeline;


  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const bucket = new Bucket(this);

    const repo = Repository.fromRepositoryName(this,"tcu","aws-tcu.de")
    const branch = 'master';
    
    // new Repository(this,'aws-tcu.de',{
    //   repositoryName: 'aws-tcu.de',
    // });

    const outputCodeCommit = new Artifact('code-commit-output');
    const codeCommitSource = new Artifact('code-commit-source');
    this.projectName = "gohugo";
    const deployArtifacts = new Artifact('cfn_templates')


    const codeCommitSourceAction = new CodeCommitSourceAction(
      {
        actionName: 'CodeCommitAction',
        repository: repo,
        branch: branch,
        trigger: CodeCommitTrigger.EVENTS,
        output: outputCodeCommit,
      }
    );

    
    const project = new PipelineProject(this, `${this.projectName}-codebuild`, {
      buildSpec: BuildSpec.fromSourceFilename('s3-website/buildspec.yml'),
      description: "Hugo Website Deployment",
      environment: {
        buildImage:  LinuxBuildImage.STANDARD_2_0,
        computeType: ComputeType.SMALL,
        privileged: false,
      },
    });

    project.addToRolePolicy(new iam.PolicyStatement({
      actions: [    "s3:Put*",
      "s3:Get*",
      "s3:Create*",
      "s3:Replicate*",
      "s3:Delete*",
      "s3:List*",
      "s3:HeadObject"],
      effect: iam.Effect.ALLOW,
      resources:  [
        "arn:aws:s3:::www.aws-tcu.de/*",
        "arn:aws:s3:::www.aws-tcu.de"
    ],
    }))
    
    const codeBuildAction = new CodeBuildAction({
      actionName: 'build',
      input: outputCodeCommit,
      outputs:[deployArtifacts],
      project: project,
    });

    // The code that defines your stack goes here
    this.pipeline = new Pipeline(this, this.projectName, {
      stages: [
        {
          stageName: 'Source',
          actions: [
            codeCommitSourceAction
          ]
        },
        {
          stageName: 'Build',
          actions: [
            codeBuildAction
          ]
        }
      ]
    });

  }
}
