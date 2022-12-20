import { Schema, model} from "mongoose";

interface IBlackListTokens {
  token: string;
}

const blackListTokensSchema = new Schema<IBlackListTokens>({
  token: { type: String, required: true },
});

const BlackListTokensModel = model<IBlackListTokens>("BlackListTokens", blackListTokensSchema);

export {BlackListTokensModel};