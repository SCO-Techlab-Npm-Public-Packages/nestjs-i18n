import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppInterceptor } from './app.interceptor';
import { TranslateModule } from '@app/nestjs-i18n';
 
@Module({
  imports: [
    TranslateModule.register({
      default: 'en',
      path: './i18n',
      encoding: 'utf8',
      header: 'accept-language',
    })
  ],
  controllers: [
    AppController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
  ],
})

export class AppModule {}
