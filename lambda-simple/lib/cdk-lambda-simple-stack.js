"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            runtime: lambda.Runtime.NODEJS_8_10,
            memorySize: 1024
        });
    }
}
exports.CdkLambdaSimpleStack = CdkLambdaSimpleStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWxhbWJkYS1zaW1wbGUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstbGFtYmRhLXNpbXBsZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUErQztBQUMvQyxxQ0FBc0M7QUFDdEMsNkJBQThCO0FBRTlCLE1BQWEsb0JBQXFCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDakQsWUFBWSxLQUFjLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLDZDQUE2QztRQUM3QyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN4QyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUcsV0FBVyxDQUFDLENBQUM7WUFDM0QsT0FBTyxFQUFFLGVBQWU7WUFDeEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFaRCxvREFZQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsYW1iZGEgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtbGFtYmRhJyk7XG5pbXBvcnQgY2RrID0gcmVxdWlyZSgnQGF3cy1jZGsvY29yZScpO1xuaW1wb3J0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbmV4cG9ydCBjbGFzcyBDZGtMYW1iZGFTaW1wbGVTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICBcbiAgICAvLyBUaGUgY29kZSB0aGF0IGRlZmluZXMgeW91ciBzdGFjayBnb2VzIGhlcmVcbiAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdIZWxsb0hhbmRsZXInLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAgJy4uL2xhbWJkYScpKSxcbiAgICAgIGhhbmRsZXI6ICdoZWxsby5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU184XzEwLFxuICAgICAgbWVtb3J5U2l6ZTogMTAyNFxuICAgIH0pO1xuICB9XG59XG5cbiJdfQ==