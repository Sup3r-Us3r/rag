export interface IngestDocumentUseCaseInputDTO {
  fileName: string;
  fileBuffer: Buffer;
  mimeType: string;
}

export interface IngestDocumentUseCaseOutputDTO {
  documentName: string;
  chunksCount: number;
}
