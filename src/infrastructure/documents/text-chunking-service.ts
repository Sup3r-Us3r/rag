import type { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Injectable, Logger } from '@nestjs/common';

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

@Injectable()
export class TextChunkingService {
  private readonly logger = new Logger(TextChunkingService.name);
  private readonly splitter: RecursiveCharacterTextSplitter;

  constructor() {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP,
      separators: ['\n\n', '\n', '. ', ' ', ''],
    });

    this.logger.log(
      `Text Chunking Service initialized (chunk size: ${CHUNK_SIZE}, overlap: ${CHUNK_OVERLAP})`,
    );
  }

  async chunk(text: string): Promise<Document[]> {
    this.logger.debug(`Chunking text (${text.length} characters)`);

    const documents = await this.splitter.createDocuments([text]);

    this.logger.debug(`Created ${documents.length} chunks`);

    return documents;
  }
}
