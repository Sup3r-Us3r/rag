import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat-module';
import { DocumentsModule } from './documents-module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ChatModule,
    DocumentsModule,
  ],
})
export class AppModule {}
