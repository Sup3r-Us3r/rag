import { UserRepository } from '@domain/users/repositories/user-repository';
import { Injectable } from '@nestjs/common';
import { Traced } from '@shared/decorators/traced';
import { NotFoundException } from '@shared/exceptions/not-found-exception';
import type {
  UpdateUserUseCaseInputDTO,
  UpdateUserUseCaseOutputDTO,
} from './update-user-dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  @Traced()
  async execute(
    input: UpdateUserUseCaseInputDTO,
  ): Promise<UpdateUserUseCaseOutputDTO> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.update({ name: input.name });
    await this.userRepository.update(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      updatedAt: user.updatedAt,
    };
  }
}
