import { IngestDocumentUseCase } from '@application/use-cases/documents/ingest-document/ingest-document-use-case';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InternalServerErrorException } from '@shared/exceptions/internal-server-error-exception';
import { ValidationException } from '@shared/exceptions/validation-exception';
import { UploadDocumentResponseDTO } from '../dtos/documents/upload-document-dto';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly ingestDocumentUseCase: IngestDocumentUseCase) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload a document for RAG ingestion',
    description:
      'Uploads a TXT or PDF file, extracts text, chunks it, generates embeddings, and stores in the vector database.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The document file to upload (.txt or .pdf)',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, type: UploadDocumentResponseDTO })
  @ApiResponse({ status: 400, type: ValidationException })
  @ApiResponse({ status: 500, type: InternalServerErrorException })
  async upload(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadDocumentResponseDTO> {
    if (!file) {
      throw new ValidationException('File is required');
    }

    return this.ingestDocumentUseCase.execute({
      fileName: file.originalname,
      fileBuffer: file.buffer,
      mimeType: file.mimetype,
    });
  }
}
