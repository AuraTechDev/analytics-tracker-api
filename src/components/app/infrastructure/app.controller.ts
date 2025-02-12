import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from '../application/app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  async regisrter(
    @Body()
    body: {
      name: string;
    },
  ) {
    const id = crypto.randomUUID();
    const apiKey = crypto.randomUUID();
    const createdAt = new Date();

    await this.appService.register({
      id,
      apiKey,
      name: body.name,
      createdAt,
    });

    return { message: 'App registered successfully' };
  }
}
