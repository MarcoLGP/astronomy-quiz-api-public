import { BlackListTokensModel } from "../infra/db/mongo/model/BlackListToken.model";
import { BlockedTokensRepositoryInterface } from "./../domain/repository/blocked-tokens.repository";

export class InsertBlockedTokensMongoRepository implements BlockedTokensRepositoryInterface {
   async insert(token: string): Promise<boolean> {
    try {
        await BlackListTokensModel.create({token});
        return true;
    } catch (error) {
        return false;
    }
   }
}