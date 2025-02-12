export const AUTH_REPOSITORY = Symbol('AuthRepository');

export interface AuthRepository {
  validate(apiKey: string): Promise<void>;
}
