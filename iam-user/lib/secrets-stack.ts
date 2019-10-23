import cdk = require('@aws-cdk/core');
import {Secret} from '@aws-cdk/aws-secretsmanager';

export class SecretsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
    
        const secret = new Secret(this, "pwSecret", {
            description: "Initial password for trainingsuser",
            secretName: "trainingsuserpassword",
            generateSecretString: {
                passwordLength: 16
            }
        });

    }
}
