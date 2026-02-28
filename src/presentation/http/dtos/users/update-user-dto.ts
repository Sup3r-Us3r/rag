import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserRequestDTO {
  @ApiPropertyOptional({ example: 'John Doe Jr.' })
  @IsString()
  @IsOptional()
  name?: string;
}

export class UpdateUserResponseDTO {
  @ApiProperty({ example: 'uuid-1234-5678' })
  id: string;

  @ApiProperty({ example: 'John Doe Jr.' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '2023-01-02T00:00:00.000Z' })
  updatedAt: Date;
}
