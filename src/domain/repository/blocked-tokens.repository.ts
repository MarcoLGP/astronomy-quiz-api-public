import { BlockedTokenProps } from "./../entities/blocked-token.entity";

export interface BlockedTokensRepositoryInterface {
  insert?(token: string): Promise<boolean>;
  getAll?(): Promise<BlockedTokenProps[] | undefined>;
}
