import { Injectable } from '@nestjs/common';
import {
  PutItemCommand,
  ScanCommand,
  ScanCommandInput,
  PutItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { AppRepository } from '../domain/repository';
import { App } from '../domain/entity';
import { DynamoDBService } from '../../../db/dynamodb.service';
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
   */
  async register(app: App): Promise<void> {
    const { id, name, apiKey, createdAt } = app.attributes;
    const params: PutItemCommandInput = {
      TableName: this.tableName,
      Item: {
        id: { S: id },
        name: { S: name },
        apiKey: { S: apiKey },
        createdAt: { S: createdAt.toString() },
      },
    };

    try {
      await this.dynamoDBService.getClient().send(new PutItemCommand(params));
    } catch (error) {
      this.errorHandler.handle(error as Error, 'Error saving event');
    }
  }

  /**
   * Retrieves all apps from the DynamoDB table.
   *
   * @returns A promise that resolves to an array of App entities.
   */
  async findAll(): Promise<App[]> {
    const params: ScanCommandInput = {
      TableName: this.tableName,
      ConsistentRead: true, // Optional: ensures most recent data
    };

    try {
      const result = await this.dynamoDBService
        .getClient()
        .send(new ScanCommand(params));

      if (!result.Items) {
        return [];
      }

      return result.Items.map((item) => {
        return new App({
          id: item.id.S as unknown as string,
          name: item.name.S as string,
          apiKey: item.apiKey.S as string,
          createdAt: new Date(item.createdAt.S as unknown as string),
        });
      });
    } catch (error) {
      this.errorHandler.handle(error as Error, 'Error getting events');
    }
  }

  /**
   * Finds a single app by its ID.
   *
   * @param id - The ID of the app to find.
   * @returns A promise that resolves to the App entity if found, or null otherwise.
   */
  async findOne(id: string): Promise<App | null> {
    const params: ScanCommandInput = {
      TableName: this.tableName,
      FilterExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': { S: id },
      },
    };

    try {
      const result = await this.dynamoDBService
        .getClient()
        .send(new ScanCommand(params));

      if (!result.Items) {
        return null;
      }

      return new App({
        id: result.Items[0].id.S as unknown as string,
        name: result.Items[0].name.S as string,
        apiKey: result.Items[0].apiKey.S as string,
        createdAt: new Date(result.Items[0].createdAt.S as unknown as string),
      });
    } catch (error) {
      this.errorHandler.handle(error as Error, 'Error getting event');
    }
  }
}
