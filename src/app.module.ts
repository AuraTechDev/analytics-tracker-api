import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dbClient } from './db/dynamo.client';
import { AnalyticsController } from './components/analytics/infrastructure/controllers/analytics.controller';
import { AnalyticsService } from './components/analytics/application/service';
import { DynamoDBEventRepository } from './components/analytics/infrastructure/database/repository';

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
    { provide: 'EventRepository', useClass: DynamoDBEventRepository },
    { provide: 'DynamoDBClient', useValue: dbClient },
  ],
})
export class AppModule {}
