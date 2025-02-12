import { Injectable } from '@nestjs/common';
import { GetItemCommandInput, GetItemCommand } from '@aws-sdk/client-dynamodb';
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

  /**
   * Validates an API key by checking its existence in the DynamoDB table.
   *
   * @param appId The API key to be validated.
   * @returns A promise that resolves when the API key is validated.
   * @throws Error if the API key is not found in the table.
   */
  async validate(appId: string): Promise<void> {
    const params: GetItemCommandInput = {
      TableName: this.tableName,
      Key: {
        id: { S: appId },
      },
    };

    try {
      await this.dynamoDBService.getClient().send(new GetItemCommand(params));
    } catch (error) {
      this.errorHandler.handle(error as Error, 'Error validating app');
    }
  }
}
