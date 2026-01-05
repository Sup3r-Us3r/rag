import { UserRepository } from '@domain/users/repositories/user-repository';
import { Injectable } from '@nestjs/common';
import { Traced } from '@shared/decorators/traced';
import type {
  ListUsersUseCaseInputDTO,
  ListUsersUseCaseOutputDTO,
} from './list-users-dto';

@Injectable()
export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  @Traced()
  async execute(
    input: ListUsersUseCaseInputDTO,
  ): Promise<ListUsersUseCaseOutputDTO> {
    const page = input.page || 1;
    const limit = input.limit || 10;
    const result = await this.userRepository.findAll(page, limit);

    return {
      data: {
        ...result,
        items: result.items.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email.value,
          createdAt: user.createdAt,
        })),
      },
    };
  }
}
