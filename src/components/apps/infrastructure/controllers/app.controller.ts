import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from '../../application/app.service';

@Controller('apps')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      name: string;
    },
  ) {
    await this.appService.register(body.name);

    return { message: 'App registered successfully' };
  }
}
