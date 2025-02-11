import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoDBService {
  private readonly client: DynamoDBClient;
  private readonly docClient: DynamoDBDocumentClient;

  constructor(private configService: ConfigService) {
    this.client = new DynamoDBClient({
      region: this.configService.get<string>('DYNAMO_REGION'),
      endpoint: this.configService.get<string>('DYNAMODB_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey:
          this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
    });

    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  getClient() {
    return this.docClient;
  }
}
