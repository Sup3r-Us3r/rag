import { DocumentRepository } from '@domain/documents/repositories/document-repository';
import { EmbeddingProvider } from '@domain/providers/embedding-provider';
import { LlmProvider } from '@domain/providers/llm-provider';
import { Injectable, Logger } from '@nestjs/common';
import type {
  AskQuestionUseCaseInputDTO,
  AskQuestionUseCaseOutputDTO,
} from './ask-question-dto';

const TOP_K = 5;

@Injectable()
export class AskQuestionUseCase {
  private readonly logger = new Logger(AskQuestionUseCase.name);

  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly llmProvider: LlmProvider,
  ) {}

  async execute(
    input: AskQuestionUseCaseInputDTO,
  ): Promise<AskQuestionUseCaseOutputDTO> {
    this.logger.log(`Processing question: ${input.question}`);

    // 1. Embed the question
    const questionEmbedding = await this.embeddingProvider.embedText(
      input.question,
    );

    // 2. Retrieve top-K similar document chunks
    const similarDocuments = await this.documentRepository.findSimilar(
      questionEmbedding,
      TOP_K,
    );

    // 3. If no context found, return a safe answer
    if (similarDocuments.length === 0) {
      this.logger.warn('No relevant documents found for the question');
      return {
        answer: "I don't have enough information to answer that.",
        sources: [],
      };
    }

    // 4. Build context from retrieved chunks
    const context = similarDocuments
      .map(
        (doc, index) =>
          `[Source ${index + 1} - ${doc.chunk.documentName}]:\n${doc.chunk.content}`,
      )
      .join('\n\n---\n\n');

    this.logger.log(
      `Retrieved ${similarDocuments.length} relevant chunks for context`,
    );

    // 5. Generate answer using LLM with context
    const answer = await this.llmProvider.generateAnswer(
      input.question,
      context,
    );

    // 6. Build sources array
    const sources = similarDocuments.map((doc) => ({
      documentName: doc.chunk.documentName,
      content:
        doc.chunk.content.length > 200
          ? `${doc.chunk.content.substring(0, 200)}...`
          : doc.chunk.content,
      similarity: doc.similarity,
    }));

    return {
      answer,
      sources,
    };
  }
}
