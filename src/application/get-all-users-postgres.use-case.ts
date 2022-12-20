import { UserProps } from "../domain/entities/user.entity";
import { UserRepositoryInterface } from "../domain/repository/user.repository";
import { UserModel } from "../infra/db/postgres/model/User.model";

export class GetAllUsersPostgresRepository implements UserRepositoryInterface {
    async getAll(): Promise<UserProps[]> {
        const allUsers = await UserModel.findAll();
        return allUsers;
    }
}
