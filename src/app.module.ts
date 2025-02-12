import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoDBModule } from './db/dynamodb.module';
import { ErrorHandlerService } from './common/error-handler.service';
import { AnalyticsController } from './components/analytics/infrastructure/analytics.controller';
import { AnalyticsService } from './components/analytics/application/service';
import { DBEventRepository } from './components/analytics/infrastructure/db.repository';
import { EVENT_REPOSITORY } from './components/analytics/domain/event.repository';
import { AuthController } from './components/auth/infrastructure/auth.controller';
import { AuthService } from './components/auth/application/service';
import { DBAppRepository } from './components/auth/infrastructure/db.repository';
import { APP_REPOSITORY } from './components/auth/domain/repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
    }),
    DynamoDBModule,
  ],
  controllers: [AnalyticsController, AuthController],
  providers: [
    ErrorHandlerService,
    AnalyticsService,
    AuthService,
    { provide: APP_REPOSITORY, useClass: DBAppRepository },
    { provide: EVENT_REPOSITORY, useClass: DBEventRepository },
  ],
})
export class AppModule {}
