import { Injectable } from '@nestjs/common';
import { PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { EventRepository } from '../../domain/event.repository';
import { Event } from '../../domain/event.entity';
import { DynamoDBService } from '../../../../db/dynamodb.service';

@Injectable()
export class DynamoDBEventRepository implements EventRepository {
  private readonly tableName = 'Events';

  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async save(event: Event): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        id: { S: event.id },
        name: { S: event.name },
        timestamp: { N: event.timestamp.toString() },
        payload: { S: JSON.stringify(event.payload) },
      },
    };

    await this.dynamoDBService.getClient().send(new PutItemCommand(params));
  }

  async findAll(): Promise<Event[]> {
    const params = { TableName: this.tableName };
    const result = await this.dynamoDBService
      .getClient()
      .send(new ScanCommand(params));

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
