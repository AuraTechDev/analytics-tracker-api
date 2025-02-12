import { App } from './app.entity';

export const AUTH_REPOSITORY = Symbol('AuthRepository');

export interface AuthRepository {
  validate(apiKey: string): Promise<App>;
}
