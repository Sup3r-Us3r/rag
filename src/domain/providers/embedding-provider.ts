export abstract class EmbeddingProvider {
  abstract embedText(text: string): Promise<number[]>;
  abstract embedTexts(texts: string[]): Promise<number[][]>;
}
