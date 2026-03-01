import { DocumentChunk } from '../entities/document-chunk-entity';

export interface SimilarDocument {
  chunk: DocumentChunk;
  similarity: number;
}

export abstract class DocumentRepository {
  abstract save(chunks: DocumentChunk[]): Promise<void>;
  abstract findSimilar(
    embedding: number[],
    topK: number,
  ): Promise<SimilarDocument[]>;
}
