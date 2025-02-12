import { Injectable, Inject } from '@nestjs/common';
import { AuthRepository, AUTH_REPOSITORY } from '../domain/auth.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
  ) {}

  async validate(apiKey: string) {
    await this.authRepository.validate(apiKey);
  }
}
