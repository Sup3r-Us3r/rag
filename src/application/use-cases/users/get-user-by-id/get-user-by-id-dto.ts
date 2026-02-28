export interface GetUserByIdUseCaseInputDTO {
  id: string;
}

export interface GetUserByIdUseCaseOutputDTO {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
