import { GetAllBlockedTokensMongoRepository } from "./get-all-blocked-tokens-mongo.use-case";

export class GetAllBlockedTokensUseCase {
  constructor(private userRepo: GetAllBlockedTokensMongoRepository) {}

  public async execute(): Promise<GetAllBlockedTokensOutput[] | undefined> {
    const tokens = await this.userRepo.getAll();
    return tokens;
  }
}

type GetAllBlockedTokensOutput = {
  token: string;
};