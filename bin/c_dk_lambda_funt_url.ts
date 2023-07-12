#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as config from '../config.json'
import { CDkLambdaFuntUrlStack } from '../lib/c_dk_lambda_funt_url-stack';

const app = new cdk.App();
new CDkLambdaFuntUrlStack(app, 'CDkLambdaFuntUrlStack', {
  env: config.environments.dev.env
});