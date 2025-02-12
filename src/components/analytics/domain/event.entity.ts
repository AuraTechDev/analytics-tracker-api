import { EventDto } from '../application/event.dto';

export interface EventModel {
  id: string;
  appId: string;
  timestamp: Date;
  eventType: string;
  eventData: Record<string, unknown>;
}

export class Event {
  constructor(public readonly attributes: EventModel) {}

  static create(dto: EventDto): Event {
    const { appId, timestamp, eventType, eventData } = dto;
    const id = crypto.randomUUID();

    return new Event({
      id,
      appId,
      timestamp,
      eventType,
      eventData,
    });
  }
}
