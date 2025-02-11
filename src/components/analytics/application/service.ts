import { Injectable } from '@nestjs/common';
import { Event } from '../domain/entity';
import { EventRepository } from '../domain/repository';

@Injectable()
export class AnalyticsService {
  constructor(private readonly eventRepository: EventRepository) {}

  async trackEvent(name: string, payload: Record<string, unknown>) {
    const event = new Event(crypto.randomUUID(), name, new Date(), payload);
    await this.eventRepository.save(event);
  }

  async getEvents(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }
}
