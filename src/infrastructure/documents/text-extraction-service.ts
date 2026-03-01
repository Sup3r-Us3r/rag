import { Injectable, Logger } from '@nestjs/common';
import { ValidationException } from '@shared/exceptions/validation-exception';
import { PDFParse } from 'pdf-parse';

@Injectable()
export class TextExtractionService {
  private readonly logger = new Logger(TextExtractionService.name);

  async extract(fileBuffer: Buffer, mimeType: string): Promise<string> {
    this.logger.debug(`Extracting text from file with mime type: ${mimeType}`);

    switch (mimeType) {
      case 'text/plain':
        return this.extractFromTxt(fileBuffer);
      case 'application/pdf':
        return this.extractFromPdf(fileBuffer);
      default:
        throw new ValidationException(
          `Unsupported file type: ${mimeType}. Supported types: .txt, .pdf`,
        );
    }
  }

  private extractFromTxt(fileBuffer: Buffer): string {
    return fileBuffer.toString('utf-8');
  }

  private async extractFromPdf(fileBuffer: Buffer): Promise<string> {
    try {
      const parser = new PDFParse(new Uint8Array(fileBuffer));
      const data = await parser.getText();

      return data.text;
    } catch (error) {
      this.logger.error(`Failed to parse PDF: ${error}`);
      throw new ValidationException(
        'Failed to extract text from PDF file. The file may be corrupted or password-protected.',
      );
    }
  }
}
