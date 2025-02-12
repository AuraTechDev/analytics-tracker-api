import { Controller, Post, Get, Body } from '@nestjs/common';
import { AnalyticsService } from '../../application/service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  async trackEvent(
    @Body()
    body: {
      appId: string;
      userId: string;
      timestamp: Date;
      eventType: string;
      eventData: Record<string, unknown>;
    },
  ) {
    await this.analyticsService.trackEvent(body);

    return { message: 'Event tracked successfully' };
  }

  @Get('events')
  async getEvents() {
    return this.analyticsService.getEvents();
  }
}
