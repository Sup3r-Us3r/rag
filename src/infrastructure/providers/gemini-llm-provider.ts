import { LlmProvider } from '@domain/providers/llm-provider';
import { GoogleGenAI } from '@google/genai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const RAG_SYSTEM_PROMPT = `You are a helpful assistant that answers questions ONLY based on the provided context.

STRICT RULES:
1. ONLY use the information from the provided context to answer questions.
2. If the context does not contain enough information to answer the question, respond exactly with: "I don't have enough information to answer that."
3. NEVER make up information or use knowledge outside the provided context.
4. Be concise and accurate in your answers.
5. When possible, reference which source document the information came from.
6. Answer in the same language as the question.`;

@Injectable()
export class GeminiLlmProvider implements LlmProvider {
  private readonly logger = new Logger(GeminiLlmProvider.name);
  private readonly ai: GoogleGenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.model =
      this.configService.get<string>('GEMINI_CHAT_MODEL') ?? 'gemini-2.5-flash';

    this.ai = new GoogleGenAI({ apiKey });

    this.logger.log(
      `Gemini LLM Provider initialized with model: ${this.model}`,
    );
  }

  async generateAnswer(question: string, context: string): Promise<string> {
    this.logger.debug(`Generating answer for question: ${question}`);

    const prompt = `Context:\n${context}\n\n---\n\nQuestion: ${question}`;

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        temperature: 0,
        maxOutputTokens: 2048,
        systemInstruction: RAG_SYSTEM_PROMPT,
      },
    });

    const answer = response.text ?? '';

    this.logger.debug(`Generated answer (${answer.length} chars)`);

    return answer;
  }
}
