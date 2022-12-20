import crypto from "crypto";
import * as dotenv from "dotenv";
dotenv.config();

export class Cryptography {
  private algorithm: string;
  private secretKey: string;

  constructor() {
    this.algorithm = process.env.CRYPTO_ALG_SECRET || "ALG";
    this.secretKey = process.env.CRYPTO_SECRET_KEY || "SECRET_KEY";
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString("hex")}*${encrypted.toString("hex")}`;
  }

  decrypt(hash: string): string {
    const iv = hash.split("*")[0];
    const content = hash.split("*")[1];
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKey,
      Buffer.from(iv, "hex")
    );
    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(content, "hex")),
      decipher.final(),
    ]);
    return decrpyted.toString();
  }

  async compare(hash: string, descrypted_to_compare: string): Promise<boolean> {
    const descrypted = this.decrypt(hash);
    if (descrypted_to_compare == descrypted) {
      return true;
    } else {
      return false;
    }
  }
}
