import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ListUsersQueryDTO {
  @ApiProperty({ example: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({ example: 10, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;
}

class UserItemDTO {
  @ApiProperty({ example: 'uuid-1234-5678' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;
}

class PaginatedUsersDTO {
  @ApiProperty({ type: [UserItemDTO] })
  items: UserItemDTO[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 10 })
  perPage: number;

  @ApiProperty({ example: 10 })
  lastPage: number;
}

export class ListUsersResponseDTO {
  @ApiProperty({ type: PaginatedUsersDTO })
  data: PaginatedUsersDTO;
}
