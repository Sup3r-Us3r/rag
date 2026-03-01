import { DocumentChunk } from '@domain/documents/entities/document-chunk-entity';
import { DocumentRepository } from '@domain/documents/repositories/document-repository';
import { EmbeddingProvider } from '@domain/providers/embedding-provider';
import { TextChunkingService } from '@infra/documents/text-chunking-service';
import { TextExtractionService } from '@infra/documents/text-extraction-service';
import { Injectable, Logger } from '@nestjs/common';
import { ValidationException } from '@shared/exceptions/validation-exception';
import type {
  IngestDocumentUseCaseInputDTO,
  IngestDocumentUseCaseOutputDTO,
} from './ingest-document-dto';

@Injectable()
export class IngestDocumentUseCase {
  private readonly logger = new Logger(IngestDocumentUseCase.name);

  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly textExtractionService: TextExtractionService,
    private readonly textChunkingService: TextChunkingService,
  ) {}

  async execute(
    input: IngestDocumentUseCaseInputDTO,
  ): Promise<IngestDocumentUseCaseOutputDTO> {
    this.logger.log(`Ingesting document: ${input.fileName}`);

    // 1. Extract text from file
    const text = await this.textExtractionService.extract(
      input.fileBuffer,
      input.mimeType,
    );

    if (!text || text.trim().length === 0) {
      throw new ValidationException(
        'Could not extract text from the uploaded file',
      );
    }

    this.logger.log(
      `Extracted ${text.length} characters from ${input.fileName}`,
    );

    // 2. Chunk text
    const chunks = await this.textChunkingService.chunk(text);

    this.logger.log(`Created ${chunks.length} chunks from ${input.fileName}`);

    // 3. Generate embeddings for all chunks
    const chunkTexts = chunks.map((chunk) => chunk.pageContent);
    const embeddings = await this.embeddingProvider.embedTexts(chunkTexts);

    this.logger.log(
      `Generated ${embeddings.length} embeddings for ${input.fileName}`,
    );

    // 4. Create domain entities
    const documentChunks = chunks.map(
      (chunk, index) =>
        new DocumentChunk({
          content: chunk.pageContent,
          embedding: embeddings[index],
          metadata: {
            ...chunk.metadata,
            fileName: input.fileName,
            mimeType: input.mimeType,
            chunkIndex: index,
          },
          documentName: input.fileName,
        }),
    );

    // 5. Store in database
    await this.documentRepository.save(documentChunks);

    this.logger.log(
      `Successfully ingested ${documentChunks.length} chunks for ${input.fileName}`,
    );

    return {
      documentName: input.fileName,
      chunksCount: documentChunks.length,
    };
  }
}
