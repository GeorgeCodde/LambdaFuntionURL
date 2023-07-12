import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { marshall } from "@aws-sdk/util-dynamodb";
const postFuntion = async (event: APIGatewayProxyEvent, ddbClient: DynamoDBClient ): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;
  if (event.body !== null) {
      const item = JSON.parse(event.body);
      console.log(item);
      const name = item.name
      const result = await ddbClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item)
      }));
      response = {
        statusCode: 200,
        body: JSON.stringify(result)
      }
  } else {
      response = {
        statusCode: 200,
        body: JSON.stringify('Se tiene que enviar nombre ')
      }
  }
    
  return response
}
export { postFuntion }