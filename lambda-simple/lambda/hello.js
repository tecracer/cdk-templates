
exports.handler = async function(event) {
  console.log('request:', JSON.stringify(event, undefined, 2));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain' },
      body: `Hello, CDK 0.36.1 again! You've hit ${event.path}\n`
    };
  };
  