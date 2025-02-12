import { Injectable } from '@nestjs/common';
import { PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { DynamoDBService } from '../../../../db/dynamodb.service';
import { ErrorHandlerService } from 'src/common/error-handler.service';
import { AuthRepository } from '../../domain/auth.repository';

@Injectable()
export class DBAuthRepository implements AuthRepository {
  private readonly tableName = 'Apps';

  constructor(
    private readonly dynamoDBService: DynamoDBService,
    private readonly errorHandler: ErrorHandlerService,
  ) {}

  async validate(apiKey: string) {
    const params: PutItemCommandInput = {
      TableName: this.tableName,
      Item: {
        apiKey: { S: apiKey },
      },
    };

    try {
      await this.dynamoDBService.getClient().send(new PutItemCommand(params));
    } catch (error) {
      this.errorHandler.handle(error as Error, 'Error validating app');
    }
  }
}
