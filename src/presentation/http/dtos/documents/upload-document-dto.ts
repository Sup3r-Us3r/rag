import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentResponseDTO {
  @ApiProperty({ example: 'my-document.pdf' })
  documentName: string;

  @ApiProperty({ example: 15 })
  chunksCount: number;
}
