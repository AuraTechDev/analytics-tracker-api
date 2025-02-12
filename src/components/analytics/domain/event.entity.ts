export interface EventModel {
  id: string;
  appId: string;
  userId: string;
  timestamp: Date;
  eventType: string;
  eventData: Record<string, unknown>;
}

export class Event {
  constructor(public readonly attributes: EventModel) {}
}
