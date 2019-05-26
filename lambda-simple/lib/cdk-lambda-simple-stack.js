"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("@aws-cdk/aws-lambda");
const path = require("path");
const cdk = require("@aws-cdk/cdk");
class CdkLambdaSimpleStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        // The code that defines your stack goes here
        new lambda.Function(this, 'HelloHandler', {
            code: lambda.Code.asset(path.join(__dirname, '../lambda')),
            handler: 'hello.handler',
            runtime: lambda.Runtime.NodeJS810,
            memorySize: 1024
        });
    }
}
exports.CdkLambdaSimpleStack = CdkLambdaSimpleStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWxhbWJkYS1zaW1wbGUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstbGFtYmRhLXNpbXBsZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUErQztBQUMvQyw2QkFBOEI7QUFDOUIsb0NBQXFDO0FBR3JDLE1BQWEsb0JBQXFCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDakQsWUFBWSxLQUFjLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLDZDQUE2QztRQUM3QyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN4QyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUcsV0FBVyxDQUFDLENBQUM7WUFDM0QsT0FBTyxFQUFFLGVBQWU7WUFDeEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUztZQUNqQyxVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFaRCxvREFZQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsYW1iZGEgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtbGFtYmRhJyk7XG5pbXBvcnQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmltcG9ydCBjZGsgPSByZXF1aXJlKCdAYXdzLWNkay9jZGsnKTtcblxuXG5leHBvcnQgY2xhc3MgQ2RrTGFtYmRhU2ltcGxlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgXG4gICAgLy8gVGhlIGNvZGUgdGhhdCBkZWZpbmVzIHlvdXIgc3RhY2sgZ29lcyBoZXJlXG4gICAgbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnSGVsbG9IYW5kbGVyJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgICcuLi9sYW1iZGEnKSksXG4gICAgICBoYW5kbGVyOiAnaGVsbG8uaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5Ob2RlSlM4MTAsXG4gICAgICBtZW1vcnlTaXplOiAxMDI0XG4gICAgfSk7XG4gIH1cbn1cblxuIl19