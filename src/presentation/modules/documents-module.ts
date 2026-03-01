import { IngestDocumentUseCase } from '@application/use-cases/documents/ingest-document/ingest-document-use-case';
import { DocumentRepository } from '@domain/documents/repositories/document-repository';
import { EmbeddingProvider } from '@domain/providers/embedding-provider';
import { PrismaService } from '@infra/database/prisma/prisma-service';
import { PrismaDocumentRepository } from '@infra/database/repositories/prisma-document-repository';
import { TextChunkingService } from '@infra/documents/text-chunking-service';
import { TextExtractionService } from '@infra/documents/text-extraction-service';
import { GeminiEmbeddingProvider } from '@infra/providers/gemini-embedding-provider';
import { Module } from '@nestjs/common';
import { DocumentsController } from '../http/controllers/documents-controller';

@Module({
  controllers: [DocumentsController],
  providers: [
    PrismaService,
    IngestDocumentUseCase,
    TextExtractionService,
    TextChunkingService,
    // Repositories & Providers Mappings
    {
      provide: DocumentRepository,
      useClass: PrismaDocumentRepository,
    },
    {
      provide: EmbeddingProvider,
      useClass: GeminiEmbeddingProvider,
    },
  ],
})
export class DocumentsModule {}
