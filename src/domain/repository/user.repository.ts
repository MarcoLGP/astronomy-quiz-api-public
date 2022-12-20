import { UserEntity, UserProps } from "../entities/user.entity";

export interface UserRepositoryInterface {
  insert?(user: UserEntity): Promise<UserProps>;
  getUserByEmail?(email: string): Promise<UserProps | false>;
  getAll?(): Promise<UserProps[]>;
  nextLevelUser?(id: string): Promise<UserProps | undefined>;
  updatePassUser?(id: string, password: string): Promise<boolean>;
  recoverPassUser?(email: string, token: string): Promise<boolean>;
}
