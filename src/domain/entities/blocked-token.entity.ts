export type BlockedTokenProps = {
  token: string;
};

export class BlockedTokenEntity {
  declare token: string;

  constructor({ token }: BlockedTokenProps) {
    this.token = token;
  }

  public toJSON() {
    return {
        token: this.token
    };
  }
}