import { Injectable, Inject } from '@nestjs/common';
import { AppModel, App } from '../domain/entity';
import { AppRepository, APP_REPOSITORY } from '../domain/repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(APP_REPOSITORY) private readonly appRepository: AppRepository,
  ) {}

  async registerApp(model: AppModel) {
    const app = new App(model);
    await this.appRepository.register(app);
  }

  async getApps(): Promise<AppModel[]> {
    const apps = (await this.appRepository.findAll()).map(
      (item) => item.attributes,
    );

    return apps;
  }

  async getApp(id: string): Promise<AppModel | null> {
    const app = await this.appRepository.findOne(id);

    return app?.attributes ?? null;
  }
}
