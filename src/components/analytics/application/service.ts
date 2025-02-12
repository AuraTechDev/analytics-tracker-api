import { Injectable, Inject } from '@nestjs/common';
import { Event, EventModel } from '../domain/event.entity';
import { EventRepository, EVENT_REPOSITORY } from '../domain/event.repository';
import { EventDto } from './event.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(EVENT_REPOSITORY) private readonly eventRepository: EventRepository,
  ) {}

  async trackEvent(dto: EventDto) {
    const event = Event.create(dto);
    await this.eventRepository.save(event);
  }

  async getEvents(): Promise<EventModel[]> {
    const events = (await this.eventRepository.findAll()).map(
      (item) => item.attributes,
    );

    return events;
  }
}
