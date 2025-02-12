import { App } from './entity';

export const APP_REPOSITORY = Symbol('AppRepository');

export interface AppRepository {
  register(app: App): Promise<void>;
  findAll(): Promise<App[]>;
  findOne(id: string): Promise<App | null>;
}
