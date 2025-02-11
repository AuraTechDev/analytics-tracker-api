import { Injectable, Inject } from '@nestjs/common';
import { Event } from '../domain/event.entity';
import { EventRepository, EVENT_REPOSITORY } from '../domain/event.repository';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(EVENT_REPOSITORY) private readonly eventRepository: EventRepository,
  ) {}

  async trackEvent(name: string, payload: Record<string, unknown>) {
    const event = new Event(crypto.randomUUID(), name, Date.now(), payload);
    await this.eventRepository.save(event);
  }

  async getEvents(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }
}
