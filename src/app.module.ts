import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoDBModule } from './db/dynamodb.module';
import { ErrorHandlerService } from './common/error-handler.service';
import { AnalyticsController } from './components/analytics/infrastructure/controllers/analytics.controller';
import { AnalyticsService } from './components/analytics/application/service';
import { DBEventRepository } from './components/analytics/infrastructure/db/repository';
import { EVENT_REPOSITORY } from './components/analytics/domain/event.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
    }),
    DynamoDBModule,
  ],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    ErrorHandlerService,
    { provide: EVENT_REPOSITORY, useClass: DBEventRepository },
  ],
})
export class AppModule {}
