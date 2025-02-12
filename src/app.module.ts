import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoDBModule } from './db/dynamodb.module';
import { ErrorHandlerService } from './common/error-handler.service';
import { AnalyticsController } from './components/analytics/infrastructure/analytics.controller';
import { AnalyticsService } from './components/analytics/application/service';
import { DBEventRepository } from './components/analytics/infrastructure/db.repository';
import { EVENT_REPOSITORY } from './components/analytics/domain/event.repository';
import { AppController } from './components/apps/infrastructure/controllers/app.controller';
import { AppService } from './components/apps/application/app.service';
import { DBAppRepository } from './components/apps/infrastructure/db/app.repository';
import { APP_REPOSITORY } from './components/apps/domain/app.repository';
import { AuthController } from './components/apps/infrastructure/controllers/auth.controller';
import { AuthService } from './components/apps/application/auth.service';
import { DBAuthRepository } from './components/apps/infrastructure/db/auth.repository';
import { AUTH_REPOSITORY } from './components/apps/domain/auth.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
    }),
    DynamoDBModule,
  ],
  controllers: [AnalyticsController, AppController, AuthController],
  providers: [
    ErrorHandlerService,
    AnalyticsService,
    AppService,
    AuthService,
    { provide: APP_REPOSITORY, useClass: DBAppRepository },
    { provide: AUTH_REPOSITORY, useClass: DBAuthRepository },
    { provide: EVENT_REPOSITORY, useClass: DBEventRepository },
  ],
})
export class AppModule {}
