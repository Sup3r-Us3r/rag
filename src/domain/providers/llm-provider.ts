export abstract class LlmProvider {
  abstract generateAnswer(question: string, context: string): Promise<string>;
}
