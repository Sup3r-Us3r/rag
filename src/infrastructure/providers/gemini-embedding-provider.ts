import { EmbeddingProvider } from '@domain/providers/embedding-provider';
import { GoogleGenAI } from '@google/genai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiEmbeddingProvider implements EmbeddingProvider {
  private readonly logger = new Logger(GeminiEmbeddingProvider.name);
  private readonly ai: GoogleGenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.model =
      this.configService.get<string>('GEMINI_EMBEDDING_MODEL') ??
      'gemini-embedding-001';

    this.ai = new GoogleGenAI({ apiKey });

    this.logger.log(
      `Gemini Embedding Provider initialized with model: ${this.model}`,
    );
  }

  async embedText(text: string): Promise<number[]> {
    const response = await this.ai.models.embedContent({
      model: this.model,
      contents: text,
      config: {
        outputDimensionality: 768,
      },
    });

    return response?.embeddings?.[0].values ?? [];
  }

  async embedTexts(texts: string[]): Promise<number[][]> {
    this.logger.debug(`Embedding ${texts.length} texts`);

    const response = await this.ai.models.embedContent({
      model: this.model,
      contents: texts,
      config: {
        outputDimensionality: 768,
      },
    });

    return (
      response?.embeddings?.map((embedding) => embedding.values ?? []) ?? []
    );
  }
}
