import { UserRepository } from '@domain/users/repositories/user-repository';
import { Injectable } from '@nestjs/common';
import { Traced } from '@shared/decorators/traced';
import { NotFoundException } from '@shared/exceptions/not-found-exception';
import type {
  GetUserByIdUseCaseInputDTO,
  GetUserByIdUseCaseOutputDTO,
} from './get-user-by-id-dto';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  @Traced()
  async execute(
    input: GetUserByIdUseCaseInputDTO,
  ): Promise<GetUserByIdUseCaseOutputDTO> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      cpf: user.cpf.formatted,
      address: {
        street: user.address.street,
        number: user.address.number,
        city: user.address.city,
        state: user.address.state,
        zipCode: user.address.zipCode,
        complement: user.address.complement,
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
