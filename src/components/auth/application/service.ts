import { Injectable, Inject } from '@nestjs/common';
import { AppModel, App } from '../domain/entity';
import { AppRepository, APP_REPOSITORY } from '../domain/repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(APP_REPOSITORY) private readonly eventRepository: AppRepository,
  ) {}

  async registerApp(model: AppModel) {
    const app = new App(model);
    await this.eventRepository.register(app);
  }

  async getApps(): Promise<AppModel[]> {
    const apps = (await this.eventRepository.findAll()).map(
      (item) => item.attributes,
    );

    return apps;
  }

  async getApp(id: string): Promise<AppModel | null> {
    const app = await this.eventRepository.findOne(id);

    return app?.attributes ?? null;
  }
}
