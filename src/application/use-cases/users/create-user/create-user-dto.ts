export interface CreateUserUseCaseInputDTO {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserUseCaseOutputDTO {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
