import { Injectable } from '@nestjs/common';
import { GetItemCommandInput, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBService } from '../../../../db/dynamodb.service';
import { ErrorHandlerService } from 'src/common/error-handler.service';
import { AuthRepository } from '../../domain/auth.repository';
import { App } from '../../domain/app.entity';

@Injectable()
export class DBAuthRepository implements AuthRepository {
  private readonly tableName = 'Apps';

  constructor(
    private readonly dynamoDBService: DynamoDBService,
    private readonly errorHandler: ErrorHandlerService,
  ) {}

  async validate(apiKey: string): Promise<App> {
    const params: GetItemCommandInput = {
      TableName: this.tableName,
      Key: {
        apiKey: { S: apiKey },
      },
    };

    try {
      const result = await this.dynamoDBService
        .getClient()
        .send(new GetItemCommand(params));

      return new App({
        id: result.Item?.id.S as string,
        name: result.Item?.name.S as string,
        apiKey: result.Item?.apiKey.S as string,
        createdAt: new Date(result.Item?.createdAt.S as string),
      });
    } catch (error) {
      this.errorHandler.handle(error as Error, 'Error validating app');
    }
  }
}
