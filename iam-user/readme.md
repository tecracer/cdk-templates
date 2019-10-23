# Iam Trainingsuser

This example creates a number of users and a common group. If you want to host a training, you can just deploy `task deploy`.

The inital password is stored in SecretsManager as *trainingsuserpassword*.

You have to retrieve the secret e.g. with the AWS console and give it to the training users.

After that you may attach profiles to the  trainigsUserGroup.

After the training, just delete the Stacks with `task destroy`.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
