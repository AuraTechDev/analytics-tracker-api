import { Injectable } from '@nestjs/common';
import {
  PutItemCommand,
  ScanCommand,
  ScanCommandInput,
  PutItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { EventRepository } from '../domain/event.repository';
import { Event } from '../domain/event.entity';
import { DynamoDBService } from '../../../db/dynamodb.service';
import { ErrorHandlerService } from 'src/common/error-handler.service';

@Injectable()
export class DBEventRepository implements EventRepository {
  private readonly tableName = 'Events';

  constructor(
    private readonly dynamoDBService: DynamoDBService,
    private readonly errorHandler: ErrorHandlerService,
  ) {}

  /**
   * Saves an analytics event to DynamoDB
   *
   * @param event The event to save
   * @returns Promise that resolves when the event is saved
   * @throws DynamoDBServiceException if the save operation fails
   */
  async save(event: Event): Promise<void> {
    const { id, appId, eventType, timestamp, eventData } = event.attributes;
    const params: PutItemCommandInput = {
      TableName: this.tableName,
      Item: {
        id: { S: id },
        appId: { S: appId },
        eventType: { S: eventType },
        timestamp: { S: timestamp.toString() },
        eventData: { S: JSON.stringify(eventData) },
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
   *
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

      return (result.Items ?? []).map((item) => {
        return new Event({
          id: item.id.S as unknown as string,
          appId: item.appId.S as string,
          eventType: item.eventType.S as string,
          timestamp: new Date(item.timestamp.S as unknown as string),
          eventData: JSON.parse(item.eventData.S as string) as Record<
            string,
            unknown
          >,
        });
      });
    } catch (error) {
      this.errorHandler.handle(error as Error, 'Error getting events');
    }
  }
}
