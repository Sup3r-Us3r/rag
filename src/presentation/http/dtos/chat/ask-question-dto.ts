import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AskQuestionRequestDTO {
  @ApiProperty({
    description: 'The question to ask the RAG system',
    example: 'What is NestJS?',
  })
  @IsString()
  @IsNotEmpty()
  question: string;
}

export class SourceResponseDTO {
  @ApiProperty({ example: 'document.txt' })
  documentName: string;

  @ApiProperty({ example: 'NestJS is a framework for building...' })
  content: string;

  @ApiProperty({ example: 0.92 })
  similarity: number;
}

export class AskQuestionResponseDTO {
  @ApiProperty({
    example:
      'NestJS is a framework for building efficient, scalable Node.js server-side applications.',
  })
  answer: string;

  @ApiProperty({ type: [SourceResponseDTO] })
  sources: SourceResponseDTO[];
}
