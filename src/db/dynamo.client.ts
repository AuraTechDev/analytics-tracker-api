import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DYNAMO_REGION } from 'src/config/env.config';

export const dbClient = new DynamoDBClient({
  region: DYNAMO_REGION,
});
