import { App } from './app.entity';

export const APP_REPOSITORY = Symbol('AppRepository');

export interface AppRepository {
  register(app: App): Promise<App>;
}
