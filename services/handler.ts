import {  APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { sendEmail } from './sesFuntion';
import { postFuntion } from './postFuntion';
const ddbClient = new DynamoDBClient({})

const getHello = async (event: APIGatewayProxyEvent): Promise<string> => {  
    const name = event.queryStringParameters?.name || 'World';
    return `Hello ${name}!`;
}

const handler = async (event: any , context: Context): Promise<APIGatewayProxyResult> => {
    let msg = ''
    console.log(event);
    const method = event.requestContext.http.method;
    
    if (method === 'GET') {
        msg = await getHello(event);
        console.log(msg);
    } else if (method === 'POST') {
        const postresponse = await postFuntion(event, ddbClient)
        return postresponse
    }else{
        msg ='No name'
    }
    const res = await sendEmail();
    console.log(res);
    const response: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify(msg)
    }
    return response
}
export { handler }