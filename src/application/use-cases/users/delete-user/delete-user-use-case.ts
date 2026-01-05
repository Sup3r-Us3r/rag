import { UserRepository } from '@domain/users/repositories/user-repository';
import { Injectable } from '@nestjs/common';
import { Traced } from '@shared/decorators/traced';
import { NotFoundException } from '@shared/exceptions/not-found-exception';
import type { DeleteUserUseCaseInputDTO } from './delete-user-dto';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  @Traced()
  async execute(input: DeleteUserUseCaseInputDTO): Promise<void> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(input.id);
  }
}
