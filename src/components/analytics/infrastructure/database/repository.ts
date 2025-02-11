import { Injectable, Inject } from '@nestjs/common';
import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { EventRepository } from '../../domain/event.repository';
import { Event } from '../../domain/event.entity';

@Injectable()
export class DynamoDBEventRepository implements EventRepository {
  constructor(
    @Inject('DynamoDBClient') private readonly dbClient: DynamoDBClient,
  ) {}

  async save(event: Event): Promise<void> {
    const params = {
      TableName: 'Events',
      Item: {
        id: { S: event.id },
        name: { S: event.name },
        timestamp: { N: event.timestamp.toString() },
        payload: { S: JSON.stringify(event.payload) },
      },
    };

    await this.dbClient.send(new PutItemCommand(params));
  }

  async findAll(): Promise<Event[]> {
    const params = { TableName: 'Events' };
    const result = await this.dbClient.send(new ScanCommand(params));
    return (result.Items || []).map(
      (item) =>
        new Event(
          item.id.S as string,
          item.name.S as string,
          Number(item.timestamp.N),
          JSON.parse(item.payload.S!) as Record<string, unknown>,
        ),
    );
  }
}
