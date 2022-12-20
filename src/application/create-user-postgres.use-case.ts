import { UserEntity, UserProps } from "../domain/entities/user.entity";
import { UserRepositoryInterface } from "../domain/repository/user.repository";
import { UserModel } from "../infra/db/postgres/model/User.model";

export class CreateUserPostgresRepository implements UserRepositoryInterface {
  async insert(user: UserEntity): Promise<UserProps> {
    const newUser = UserModel.create(user);
    (await newUser).save();
    const userJSON = user.toJSON();
    return userJSON;
  }
}
