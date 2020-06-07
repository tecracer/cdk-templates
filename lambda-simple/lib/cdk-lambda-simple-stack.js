"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkLambdaSimpleStack = void 0;
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const path = require("path");
class CdkLambdaSimpleStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        // The code that defines your stack goes here
        new lambda.Function(this, 'HelloHandler', {
            code: lambda.Code.asset(path.join(__dirname, '../lambda')),
            handler: 'hello.handler',
            runtime: lambda.Runtime.NODEJS_10_X,
            memorySize: 1024
        });
    }
}
exports.CdkLambdaSimpleStack = CdkLambdaSimpleStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWxhbWJkYS1zaW1wbGUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstbGFtYmRhLXNpbXBsZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4Q0FBK0M7QUFDL0MscUNBQXNDO0FBQ3RDLDZCQUE4QjtBQUU5QixNQUFhLG9CQUFxQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2pELFlBQVksS0FBYyxFQUFFLEVBQVU7UUFDcEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQiw2Q0FBNkM7UUFDN0MsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDeEMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFHLFdBQVcsQ0FBQyxDQUFDO1lBQzNELE9BQU8sRUFBRSxlQUFlO1lBQ3hCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsVUFBVSxFQUFFLElBQUk7U0FDakIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBWkQsb0RBWUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbGFtYmRhID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWxhbWJkYScpO1xuaW1wb3J0IGNkayA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2NvcmUnKTtcbmltcG9ydCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG5leHBvcnQgY2xhc3MgQ2RrTGFtYmRhU2ltcGxlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgXG4gICAgLy8gVGhlIGNvZGUgdGhhdCBkZWZpbmVzIHlvdXIgc3RhY2sgZ29lcyBoZXJlXG4gICAgbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnSGVsbG9IYW5kbGVyJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgICcuLi9sYW1iZGEnKSksXG4gICAgICBoYW5kbGVyOiAnaGVsbG8uaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTBfWCxcbiAgICAgIG1lbW9yeVNpemU6IDEwMjRcbiAgICB9KTtcbiAgfVxufVxuXG4iXX0=