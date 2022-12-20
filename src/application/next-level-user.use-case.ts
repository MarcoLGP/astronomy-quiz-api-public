import { UserEntity } from "../domain/entities/user.entity";
import { NextLevelUserPostgresRepository } from "./next-level-user-postgres-use-case";

export class NextLevelUserUseCase {
  constructor(private userRepo: NextLevelUserPostgresRepository) {}

  public async execute(id: string): Promise<NextLevelUserOutput | undefined> {
    const res_user = await this.userRepo.nextLevelUser(id);
    if (res_user) {
      const user = new UserEntity(res_user);
      return user.toJSON();
    } else {
      return undefined;
    }
  }
}

export type NextLevelUserOutput = {
  id?: string;
  name: string;
  photo?: string;
  providerSocialSign?: string;
  email: string;
  password?: string;
  level: number;
};