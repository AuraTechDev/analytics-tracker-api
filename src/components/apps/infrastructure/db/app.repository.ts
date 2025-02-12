import { Injectable } from '@nestjs/common';
import { PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { AppRepository } from '../../domain/app.repository';
import { App } from '../../domain/app.entity';
import { DynamoDBService } from '../../../../db/dynamodb.service';
import { ErrorHandlerService } from 'src/common/error-handler.service';

@Injectable()
export class DBAppRepository implements AppRepository {
  private readonly tableName = 'Apps';

  constructor(
    private readonly dynamoDBService: DynamoDBService,
    private readonly errorHandler: ErrorHandlerService,
  ) {}

  /**
   * Registers a new app in the DynamoDB table.
   *
   * @param app - The app entity to register.
   * @returns A promise that resolves when the app is saved.
   * @throws Error if the app cannot be saved.
   */
  async register(app: App): Promise<App> {
    const { id, name, createdAt } = app.attributes;
    const params: PutItemCommandInput = {
      TableName: this.tableName,
      Item: {
        id: { S: id },
        name: { S: name },
        createdAt: { S: createdAt.toString() },
      },
    };

    try {
      await this.dynamoDBService.getClient().send(new PutItemCommand(params));

      return app;
    } catch (error) {
      this.errorHandler.handle(error as Error, 'Error saving event');
    }
  }
}
