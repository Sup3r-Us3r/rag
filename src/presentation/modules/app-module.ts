import { EmailProvider } from '@domain/providers/email-provider';
import { EmailTemplateService } from '@infra/email/email-template-service';
import { RedisCacheProvider } from '@infra/providers/redis-cache-provider';
import { SmtpEmailProvider } from '@infra/providers/smtp-email-provider';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat-module';
import { DocumentsModule } from './documents-module';
import { UsersModule } from './users-module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    ChatModule,
    DocumentsModule,
  ],
  providers: [
    RedisCacheProvider,
    EmailTemplateService,
    SmtpEmailProvider,
    {
      provide: EmailProvider,
      useExisting: SmtpEmailProvider,
    },
  ],
  exports: [EmailProvider, EmailTemplateService],
})
export class AppModule {}
