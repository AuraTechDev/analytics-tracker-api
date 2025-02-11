import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoDBService {
  private readonly client: DynamoDBClient;
  private readonly docClient: DynamoDBDocumentClient;

  constructor() {
    const {
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
      DYNAMODB_ENDPOINT,
      DYNAMO_REGION,
    } = process.env;
    this.client = new DynamoDBClient({
      region: DYNAMO_REGION as string,
      endpoint: DYNAMODB_ENDPOINT,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID || '',
        secretAccessKey: AWS_SECRET_ACCESS_KEY || '',
      },
    });

    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  getClient() {
    return this.docClient;
  }
}
