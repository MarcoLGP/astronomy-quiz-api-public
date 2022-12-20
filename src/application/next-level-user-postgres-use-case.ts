import { UserProps } from "./../domain/entities/user.entity";
import { UserRepositoryInterface } from "../domain/repository/user.repository";
import { UserModel } from "../infra/db/postgres/model/User.model";

export class NextLevelUserPostgresRepository
  implements UserRepositoryInterface
{
  async nextLevelUser(id: string): Promise<UserProps | undefined> {
    const resUser = await UserModel.findOne({ where: { id } });
    if (resUser) {
      const userIncremented = await resUser?.increment("level", { by: 1 });
      userIncremented.save();
      return userIncremented.get();
    } else {
      return undefined;
    }
  }
}
