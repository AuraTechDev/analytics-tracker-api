import { Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from '../../application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate')
  async validate(@Headers('api-key') apiKey: string) {
    await this.authService.validate(apiKey);

    return { message: 'App validated successfully' };
  }
}
