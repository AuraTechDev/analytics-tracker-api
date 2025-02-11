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

@Injectable()
export class DynamoDBEventRepository implements EventRepository {
  private readonly tableName = 'Events';

  constructor(private readonly dynamoDBService: DynamoDBService) {}

  /**
   * Saves an analytics event to DynamoDB
   * @param event The event to save
   * @throws DynamoDBError if the save operation fails
   */
  async save(event: Event): Promise<void> {
    try {
      const params: PutItemCommandInput = {
        TableName: this.tableName,
        Item: {
          id: { S: event.id },
          name: { S: event.name },
          timestamp: { N: event.timestamp.toString() },
          payload: { S: JSON.stringify(event.payload) },
        },
      };

      await this.dynamoDBService.getClient().send(new PutItemCommand(params));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch events from database: ${errorMessage}`);
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
        try {
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
        } catch (parseError: unknown) {
          console.error('Error parsing event item:', parseError, item);
          const errorMessage =
            parseError instanceof Error ? parseError.message : 'Unknown error';
          throw new Error(`Failed to parse event: ${errorMessage}`);
        }
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch events from database: ${errorMessage}`);
    }
  }
}
