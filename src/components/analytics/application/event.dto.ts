export interface EventDto {
  appId: string;
  timestamp: Date;
  eventType: string;
  eventData: Record<string, unknown>;
}
