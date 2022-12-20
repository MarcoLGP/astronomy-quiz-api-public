import { InsertBlockedTokensMongoRepository } from "./create-blocked-token-mongo.use-case";

export class InsertBlockedTokensUseCase {
  constructor(private userRepo: InsertBlockedTokensMongoRepository) {}

  public async execute(token: string): Promise<boolean> {
    const res = await this.userRepo.insert(token);
    return res;
  }
}