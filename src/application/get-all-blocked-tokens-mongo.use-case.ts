import { BlockedTokenProps } from "./../domain/entities/blocked-token.entity";
import { BlackListTokensModel } from "../infra/db/mongo/model/BlackListToken.model";
import { BlockedTokensRepositoryInterface } from "./../domain/repository/blocked-tokens.repository";

export class GetAllBlockedTokensMongoRepository implements BlockedTokensRepositoryInterface {
    async getAll(): Promise<BlockedTokenProps[] | undefined> {
        const tokens: BlockedTokenProps[] = [];
        const res_tokens = await BlackListTokensModel.find({});
        if (res_tokens.length > 0) {
            res_tokens.forEach((doc) => {
                tokens.push({token: doc.token});
            });
            return res_tokens;
        } else {
            return undefined;
        }
    }
}