import {CfnOutput, Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as config from '../config.json'
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { FunctionUrlAuthType, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';


export class CDkLambdaFuntUrlStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //DyanamoDB table definition
    const holaTable = new Table(this, 'HolaTable', {
      partitionKey: {
        name: 'name',
        type: AttributeType.STRING
      }
    })
    
    //Lambda funtion definition

    const holaFuntion = new NodejsFunction(this, 'HolaFunction', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: join(__dirname, '..', 'services', 'handler.ts'),
      environment: {
        EMAIL_TO: config.environments.dev.emailto,
        EMAIL_FROM: config.environments.dev.emailfrom,
        TABLE_NAME: holaTable.tableName,
        REGION: config.environments.dev.env.region
      }
    })

    holaTable.grantReadWriteData(holaFuntion);

    const holaFuntionURL = holaFuntion.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
      }
    })

    holaFuntion.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: ['*'],
            actions: [
                'ses:SendEmail',
                
            ]
        }))

    new CfnOutput(this, 'HolaFunctionURL', {
      value: holaFuntionURL.url
    })

  }
}
