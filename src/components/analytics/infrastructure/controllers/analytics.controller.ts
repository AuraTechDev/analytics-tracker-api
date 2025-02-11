import { Controller, Post, Get, Body } from '@nestjs/common';
import { AnalyticsService } from '../../application/service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  async trackEvent(
    @Body() body: { name: string; payload: Record<string, unknown> },
  ) {
    await this.analyticsService.trackEvent(body.name, body.payload);
    return { message: 'Event tracked successfully' };
  }

  @Get('events')
  async getEvents() {
    return this.analyticsService.getEvents();
  }
}
