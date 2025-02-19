import { Controller, Post, Headers, HttpCode } from '@nestjs/common';
import { AuthService } from '../../application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate')
  @HttpCode(200)
  async validate(@Headers('x-app-id') appId: string) {
    await this.authService.validate(appId);

    return { message: 'App validated successfully' };
  }
}
