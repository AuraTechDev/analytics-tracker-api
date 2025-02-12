import { Injectable, Inject } from '@nestjs/common';
import { AppModel, App } from '../domain/app.entity';
import { AppRepository, APP_REPOSITORY } from '../domain/app.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(APP_REPOSITORY) private readonly appRepository: AppRepository,
  ) {}

  async register(model: AppModel) {
    const app = new App(model);
    await this.appRepository.register(app);
  }
}
