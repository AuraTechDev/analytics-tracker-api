import { Injectable, Inject } from '@nestjs/common';
import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { EventRepository } from '../../domain/repository';
import { Event } from '../../domain/entity';

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
        type: { S: event.name },
        timestamp: { N: String(event.timestamp) },
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
          item.type.S as string,
          new Date(Number(item.timestamp.N)),
          {},
        ),
    );
  }
}
