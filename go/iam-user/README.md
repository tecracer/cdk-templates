# Iam Trainingsuser

This example creates a number of users and a common group. If you want to host a training, you can just deploy `task deploy`.

The inital password is stored in SecretsManager as *trainingsuserpassword*.

Example:

```bash
aws secretsmanager create-secret --name trainingsuserpassword --secret-string "0cb3dF666#df400"
```

You have to retrieve the secret e.g. with the AWS console and give it to the training users.

After that you may attach profiles to the  trainigsUserGroup.

After the training, just delete the Stacks with `task destroy`.

