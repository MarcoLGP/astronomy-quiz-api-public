import { UserEntity } from "../domain/entities/user.entity";
import { GetUserByEmailPostgresRepository } from "./get-user-by-email-postgres-use-case";

export class GetUserByEmailUseCase {
  constructor(private userRepo: GetUserByEmailPostgresRepository) { }

  public async execute(email: string): Promise<GetUserByEmailOutput | false> {
    const res_user = await this.userRepo.getUserByEmail(email);
    if (res_user) {
      const user = new UserEntity(res_user);
      return user.toJSON();
    } else {
      return false;
    }
  }
}

export type GetUserByEmailOutput = {
  id?: string;
  name: string;
  photo?: string;
  providerSocialSign?: string;
  email: string;
  password?: string;
  level: number;
};