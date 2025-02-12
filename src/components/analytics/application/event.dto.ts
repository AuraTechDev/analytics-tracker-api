export interface EventDto {
  appId: string;
  userId: string;
  timestamp: Date;
  eventType: string;
  eventData: Record<string, unknown>;
}
