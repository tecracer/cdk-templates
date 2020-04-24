import json

def lambda_handler(event, context):

    # log entry for CloudWatchLogs
    print("Hello from Lambda!")

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }