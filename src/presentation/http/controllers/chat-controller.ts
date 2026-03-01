import { AskQuestionUseCase } from '@application/use-cases/chat/ask-question/ask-question-use-case';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InternalServerErrorException } from '@shared/exceptions/internal-server-error-exception';
import {
  AskQuestionRequestDTO,
  AskQuestionResponseDTO,
} from '../dtos/chat/ask-question-dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly askQuestionUseCase: AskQuestionUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Ask a question using RAG',
    description:
      'Sends a question that is answered based on previously ingested documents using Retrieval-Augmented Generation.',
  })
  @ApiResponse({ status: 200, type: AskQuestionResponseDTO })
  @ApiResponse({ status: 500, type: InternalServerErrorException })
  async ask(
    @Body() body: AskQuestionRequestDTO,
  ): Promise<AskQuestionResponseDTO> {
    return this.askQuestionUseCase.execute({
      question: body.question,
    });
  }
}
