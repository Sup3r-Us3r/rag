export interface UpdateUserUseCaseInputDTO {
  id: string;
  name?: string;
}

export interface UpdateUserUseCaseOutputDTO {
  id: string;
  name: string;
  email: string;
  updatedAt: Date;
}
