import { UserEntity } from "../domain/entities/user.entity";
import { CreateUserPostgresRepository } from "./create-user-postgres.use-case";

export class CreateUserUseCase {
  constructor(private userRepo: CreateUserPostgresRepository) {}

  public async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const user = new UserEntity(input);
    await this.userRepo.insert(user);
    return user.toJSON();
  }
}

type CreateUserInput = {
  name: string;
  photo?: string;
  providerSocialSign?: string;
  email: string;
  password?: string;
  level: number;
};

type CreateUserOutput = {
  name: string;
  photo?: string;
  providerSocialSign?: string;
  email: string;
  password?: string;
  level: number;
};
