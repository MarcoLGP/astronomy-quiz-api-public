import { UserRepositoryInterface } from "../domain/repository/user.repository";
import { UserModel } from "../infra/db/postgres/model/User.model";

export class UpdatePassUserPostgresRepository implements UserRepositoryInterface {
  async updatePassUser(id: string, password: string): Promise<boolean> {
      const updatedUser = await UserModel.update({password}, {where: {id}});
      if (updatedUser) {
        return true;
      } else {
        return false;
      }
  }
}
