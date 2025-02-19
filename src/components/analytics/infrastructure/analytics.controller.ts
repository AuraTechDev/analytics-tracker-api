import { Controller, Post, Get, Headers, Body } from '@nestjs/common';
import { AnalyticsService } from '../application/service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('event')
  async trackEvent(
    @Headers('x-api-id') appId: string,
    @Body()
    body: {
      timestamp: Date;
      eventType: string;
      eventData: Record<string, unknown>;
    },
  ) {
    await this.analyticsService.trackEvent({ appId, ...body });

    return { message: 'Event tracked successfully' };
  }

  @Get('data')
  async getEvents() {
    return this.analyticsService.getEvents();
  }
}
