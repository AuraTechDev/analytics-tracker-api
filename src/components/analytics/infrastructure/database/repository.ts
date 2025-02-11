import { Injectable } from '@nestjs/common';
import {
  PutItemCommand,
  ScanCommand,
  ScanCommandInput,
  PutItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { EventRepository } from '../../domain/event.repository';
import { Event } from '../../domain/event.entity';
import { DynamoDBService } from '../../../../db/dynamodb.service';
import { ErrorHandler } from 'src/common/error-handler';

@Injectable()
export class DBEventRepository implements EventRepository {
  private readonly tableName = 'Events';

  constructor(
    private readonly dynamoDBService: DynamoDBService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  /**
   * Saves an analytics event to DynamoDB
   * @param event The event to save
   * @throws DynamoDBError if the save operation fails
   */
  async save(event: Event): Promise<void> {
    const params: PutItemCommandInput = {
      TableName: this.tableName,
      Item: {
        id: { S: event.id },
        name: { S: event.name },
        timestamp: { N: event.timestamp.toString() },
        payload: { S: JSON.stringify(event.payload) },
      },
    };

    try {
      await this.dynamoDBService.getClient().send(new PutItemCommand(params));
    } catch (error) {
      this.errorHandler.handle(error as Error, 'Error saving event');
    }
  }

  /**
   * Retrieves all events from DynamoDB
   * @returns Promise containing an array of Event objects
   * @throws Error if fetching or parsing events fails
   */
  async findAll(): Promise<Event[]> {
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
        if (
          !item.id?.S ||
          !item.name?.S ||
          !item.timestamp?.N ||
          !item.payload?.S
        ) {
          throw new Error('Invalid item structure');
        }

        return new Event(
          item.id.S,
          item.name.S,
          Number(item.timestamp.N),
          JSON.parse(item.payload.S) as Record<string, unknown>,
        );
      });
    } catch (error) {
      this.errorHandler.handle(error as Error, 'Error getting events');
    }
  }
}
