const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const lambda = new AWS.Lambda();

async function executeUserCode(code) {
    const params = {
        FunctionName: process.env.LAMBDA_FUNCTION_NAME,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({ code }),
    };
    try {
        console.log({params})
        const data = await lambda.invoke(params).promise();
        console.log('Lambda Response:', data);
        return JSON.parse(data.Payload);
    } catch (error) {
        console.error('Error invoking Lambda function:', error);
        throw error;
    }
}

module.exports = { executeUserCode };
