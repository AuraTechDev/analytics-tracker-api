import { Controller, Post, Get, Body } from '@nestjs/common';
import { AnalyticsService } from '../../application/service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('event')
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
    const id = crypto.randomUUID();
    await this.analyticsService.trackEvent({ id, ...body });

    return { message: 'Event tracked successfully' };
  }

  @Get('data')
  async getEvents() {
    return this.analyticsService.getEvents();
  }
}
