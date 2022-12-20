import crypto from "crypto";

export type UserProps = {
  id?: string;
  name: string;
  photo?: string;
  email: string;
  providerSocialSign?: string;
  password?: string;
  level: number;
};

class UserEntity {
  declare readonly id?: string;
  declare name: string;
  declare photo?: string;
  declare email: string;
  declare providerSocialSign?: string;
  declare password?: string;
  declare level: number;

  constructor({ name, email, password, level, id, photo, providerSocialSign }: UserProps) {
    this.id = id || crypto.randomUUID();
    this.name = name;
    this.email = email;
    this.providerSocialSign = providerSocialSign;
    this.photo = photo;
    this.password = password ;
    this.level = level;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      providerSocialSign: this.providerSocialSign,
      photo: this.photo,
      email: this.email,
      password: this.password,
      level: this.level,
    };
  }
}

export { UserEntity };
