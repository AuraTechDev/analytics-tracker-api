import { Injectable, Inject } from '@nestjs/common';
import { App } from '../domain/app.entity';
import { AppRepository, APP_REPOSITORY } from '../domain/app.repository';

@Injectable()
export class AppService {
  constructor(
    @Inject(APP_REPOSITORY) private readonly appRepository: AppRepository,
  ) {}

  async register(name: string) {
    const app = App.create(name);
    await this.appRepository.register(app);
  }
}
