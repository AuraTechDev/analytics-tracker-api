import { Event } from './event.entity';

export const EVENT_REPOSITORY = Symbol('EventRepository');

export interface EventRepository {
  save(event: Event): Promise<void>;
  findAll(): Promise<Event[]>;
}
