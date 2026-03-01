import { AskQuestionUseCase } from '@application/use-cases/chat/ask-question/ask-question-use-case';
import { DocumentRepository } from '@domain/documents/repositories/document-repository';
import { EmbeddingProvider } from '@domain/providers/embedding-provider';
import { LlmProvider } from '@domain/providers/llm-provider';
import { PrismaService } from '@infra/database/prisma/prisma-service';
import { PrismaDocumentRepository } from '@infra/database/repositories/prisma-document-repository';
import { GeminiEmbeddingProvider } from '@infra/providers/gemini-embedding-provider';
import { GeminiLlmProvider } from '@infra/providers/gemini-llm-provider';
import { Module } from '@nestjs/common';
import { ChatController } from '../http/controllers/chat-controller';

@Module({
  controllers: [ChatController],
  providers: [
    PrismaService,
    AskQuestionUseCase,
    // Repositories & Providers Mappings
    {
      provide: DocumentRepository,
      useClass: PrismaDocumentRepository,
    },
    {
      provide: EmbeddingProvider,
      useClass: GeminiEmbeddingProvider,
    },
    {
      provide: LlmProvider,
      useClass: GeminiLlmProvider,
    },
  ],
})
export class ChatModule {}
