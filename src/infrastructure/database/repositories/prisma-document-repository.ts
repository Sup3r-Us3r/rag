import { DocumentChunk } from '@domain/documents/entities/document-chunk-entity';
import {
  DocumentRepository,
  type SimilarDocument,
} from '@domain/documents/repositories/document-repository';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma-service';

@Injectable()
export class PrismaDocumentRepository implements DocumentRepository {
  private readonly logger = new Logger(PrismaDocumentRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async save(chunks: DocumentChunk[]): Promise<void> {
    this.logger.debug(`Saving ${chunks.length} document chunks`);

    for (const chunk of chunks) {
      const embeddingStr = `[${chunk.embedding.join(',')}]`;

      await this.prisma.$queryRawUnsafe(
        `INSERT INTO document_chunks (id, content, embedding, metadata, document_name, created_at)
         VALUES ($1, $2, $3::vector, $4::jsonb, $5, $6)`,
        chunk.id,
        chunk.content,
        embeddingStr,
        JSON.stringify(chunk.metadata),
        chunk.documentName,
        chunk.createdAt,
      );
    }

    this.logger.debug(`Successfully saved ${chunks.length} chunks`);
  }

  async findSimilar(
    embedding: number[],
    topK: number,
  ): Promise<SimilarDocument[]> {
    this.logger.debug(`Finding top ${topK} similar documents`);

    const embeddingStr = `[${embedding.join(',')}]`;

    const results = await this.prisma.$queryRawUnsafe<
      Array<{
        id: string;
        content: string;
        metadata: Record<string, unknown>;
        document_name: string;
        created_at: Date;
        similarity: number;
      }>
    >(
      `SELECT
        id,
        content,
        metadata,
        document_name,
        created_at,
        1 - (embedding <=> $1::vector) as similarity
      FROM document_chunks
      ORDER BY embedding <=> $1::vector
      LIMIT $2`,
      embeddingStr,
      topK,
    );

    this.logger.debug(`Found ${results.length} similar documents`);

    return results.map((row) => ({
      chunk: new DocumentChunk({
        id: row.id,
        content: row.content,
        embedding: [],
        metadata: row.metadata,
        documentName: row.document_name,
        createdAt: row.created_at,
      }),
      similarity: Number(row.similarity),
    }));
  }
}
