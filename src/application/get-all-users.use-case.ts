import { GetAllUsersPostgresRepository } from "./get-all-users-postgres.use-case";

export class GetAllUsersUseCase {
  constructor(private userRepo: GetAllUsersPostgresRepository) {}

  public async execute(): Promise<GetAllUsersOutput[]> {
    const users = await this.userRepo.getAll();
    return users;
  }
}

type GetAllUsersOutput = {
  name: string;
  photo?: string;
  providerSocialSign?: string;
  email: string;
  password?: string;
  level: number;
};
