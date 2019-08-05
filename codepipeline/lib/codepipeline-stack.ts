import cdk = require('@aws-cdk/core');
import { BuildSpec,BuildEnvironmentVariable, PipelineProject, LinuxBuildImage, ComputeType } from '@aws-cdk/aws-codebuild'
import { Repository } from '@aws-cdk/aws-codecommit'
import { Pipeline, Artifact } from '@aws-cdk/aws-codepipeline';
import {CodeBuildAction,CodeCommitSourceAction,CodeCommitTrigger } from '@aws-cdk/aws-codepipeline-actions';
import {PolicyStatement,Effect} from '@aws-cdk/aws-iam';
import { Bucket } from '@aws-cdk/aws-s3';


export class CodepipelineStack extends cdk.Stack {
  projectName: string;
  pipeline: Pipeline;


  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // =====
    // Input: CodeCommit Repository    
    // Uncomment this to use
    // existing CodeCommit repository
    // const repo = Repository.fromRepositoryName(this,"hugorepository","myhugorepositoryname")
    // =====
    
    // =====
    // CodeCommit repository
    const repo = new Repository(this,'hugorepository',{
      repositoryName: 'myhugorepositoryname',
    });
    const branch = 'master';
    // =====
    
    
    // =====
    // Websitebucket
    // new Bucket
    const bucket = new Bucket(this,'websitebucket');
    const bucketPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "s3:Put*",
        "s3:Get*",
        "s3:List*"
        
      ],
      resources: [bucket.arnForObjects("*")]
    });
    bucketPolicy.addServicePrincipal("codebuild.amazonaws.com");
    bucket.addToResourcePolicy(bucketPolicy);
    const websitebucket: BuildEnvironmentVariable = { value: bucket.bucketName};
    // or use existing bucket
    // const websitebucket: BuildEnvironmentVariable = { value: 'mywebsitebucketname};
    // =====

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
      buildSpec: BuildSpec.fromSourceFilename('buildspec.yml'),
      description: "Hugo Website Deployment",
      environment: {
        buildImage:  LinuxBuildImage.STANDARD_2_0,
        computeType: ComputeType.SMALL,
        privileged: true,
      },
      environmentVariables: {
        'bucket':websitebucket,
      }
    });

    project.addToRolePolicy(new PolicyStatement({
      actions: [    
        "s3:Put*",
        "s3:Get*",
        "s3:Create*",
        "s3:Replicate*",
        "s3:Delete*",
        "s3:List*",
        "s3:ListBucket"
      ],
      effect: Effect.ALLOW,
      resources:  [
        "arn:aws:s3:::"+websitebucket.value+"/*",
        "arn:aws:s3:::"+websitebucket.value
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

    // =====
    // Output
    new cdk.CfnOutput(this, 'websitebucketout',{
      description: "Bucket name of website bucket",
      value: bucket.bucketName,
    })
    new cdk.CfnOutput(this,'repocloneurl',{
      description: "git remote add origin <this>",
      value: repo.repositoryCloneUrlHttp,
    })
    // =====

  }
}
