import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetUserByIdParamDTO {
  @ApiProperty({ example: 'uuid-1234-5678' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

class AddressResponseDTO {
  @ApiProperty({ example: 'Main Street' })
  street: string;

  @ApiProperty({ example: '123' })
  number: string;

  @ApiProperty({ example: 'New York' })
  city: string;

  @ApiProperty({ example: 'NY' })
  state: string;

  @ApiProperty({ example: '10001' })
  zipCode: string;

  @ApiProperty({ required: false, example: 'Apt 4B' })
  complement?: string;
}

export class GetUserByIdResponseDTO {
  @ApiProperty({ example: 'uuid-1234-5678' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '12345678901' })
  cpf: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ type: AddressResponseDTO })
  address: AddressResponseDTO;
}
