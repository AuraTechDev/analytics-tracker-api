import { Event } from './entity';

export interface EventRepository {
  save(event: Event): Promise<void>;
  findAll(): Promise<Event[]>;
}
