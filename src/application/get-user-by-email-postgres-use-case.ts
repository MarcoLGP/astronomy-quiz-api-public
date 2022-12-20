import { UserProps } from "./../domain/entities/user.entity";
import { UserRepositoryInterface } from "../domain/repository/user.repository";
import { UserModel } from "../infra/db/postgres/model/User.model";

export class GetUserByEmailPostgresRepository implements UserRepositoryInterface {
  async getUserByEmail(email: string): Promise<UserProps | false > {
    const res_query_user = await UserModel.findOne({ where: { email } });
    if (res_query_user) {
      return res_query_user?.toJSON();
    } else {
      return false;
    } 
  }
}
