import { Injectable, Inject } from '@nestjs/common';
import { Event, EventModel } from '../domain/event.entity';
import { EventRepository, EVENT_REPOSITORY } from '../domain/event.repository';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(EVENT_REPOSITORY) private readonly eventRepository: EventRepository,
  ) {}

  async trackEvent(model: EventModel) {
    const event = new Event(model);
    await this.eventRepository.save(event);
  }

  async getEvents(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }
}
