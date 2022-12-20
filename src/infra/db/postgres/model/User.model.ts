import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import { sequelize } from "../db_connection";

class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare photo: CreationOptional<string>;
  declare email: string;
  declare providerSocialSign: CreationOptional<string>;
  declare password: CreationOptional<string>;
  declare level: number;
  declare createdAt: CreationOptional<Date>;
}

UserModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
    },
    photo: {
      type: DataTypes.STRING,
    },
    providerSocialSign: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    level: {
      type: DataTypes.INTEGER,
    },
    password: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "Users",
    freezeTableName: true,
    sequelize,
  }
);

UserModel.sync();

export { UserModel };
