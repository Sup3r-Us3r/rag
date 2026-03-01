import { randomUUID } from 'node:crypto';

export interface DocumentChunkProps {
  id?: string;
  content: string;
  embedding: number[];
  metadata: Record<string, unknown>;
  documentName: string;
  createdAt?: Date;
}

export class DocumentChunk {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, unknown>;
  documentName: string;
  createdAt: Date;

  constructor(props: DocumentChunkProps) {
    this.id = props.id ?? randomUUID();
    this.content = props.content;
    this.embedding = props.embedding;
    this.metadata = props.metadata;
    this.documentName = props.documentName;
    this.createdAt = props.createdAt ?? new Date();
  }
}
