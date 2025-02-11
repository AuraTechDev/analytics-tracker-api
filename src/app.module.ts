import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dbClient } from './db/dynamo.client';
import { AnalyticsController } from './components/analytics/infrastructure/controllers/analytics.controller';
import { AnalyticsService } from './components/analytics/application/service';
import { DynamoDBEventRepository } from './components/analytics/infrastructure/database/repository';
import { EVENT_REPOSITORY } from './components/analytics/domain/event.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
    }),
  ],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    { provide: EVENT_REPOSITORY, useClass: DynamoDBEventRepository },
    { provide: 'DynamoDBClient', useValue: dbClient },
  ],
})
export class AppModule {}
