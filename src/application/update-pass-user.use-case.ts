import { UpdatePassUserPostgresRepository } from "./update-pass-user-postgres-use-case";

export class UpdatePassUserUseCase {
  constructor(private userRepo: UpdatePassUserPostgresRepository) {}

  public async execute(id: string, password: string): Promise<boolean> {
    return await this.userRepo.updatePassUser(id, password);
  }
}