import { Injectable, Inject } from '@nestjs/common';
import { App, AppModel } from '../domain/app.entity';
import { AppRepository, APP_REPOSITORY } from '../domain/app.repository';

@Injectable()
export class AppService {
  constructor(
    @Inject(APP_REPOSITORY) private readonly appRepository: AppRepository,
  ) {}

  async register(name: string): Promise<AppModel> {
    const app = App.create(name);
    const storedApp = await this.appRepository.register(app);

    return storedApp.attributes;
  }
}
