export interface AskQuestionUseCaseInputDTO {
  question: string;
}

export interface SourceDTO {
  documentName: string;
  content: string;
  similarity: number;
}

export interface AskQuestionUseCaseOutputDTO {
  answer: string;
  sources: SourceDTO[];
}
