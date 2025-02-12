import { Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from '../../application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate')
  async validate(@Headers('app-id') appId: string) {
    await this.authService.validate(appId);

    return { message: 'App validated successfully' };
  }
}
