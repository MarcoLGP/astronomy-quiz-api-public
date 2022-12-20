import { RecoveryPassUserNodemailerRepository } from "./recovery-pass-user-nodemailer.use-case";

export class RecoveryPassUserUseCase {
  constructor(private userRepo: RecoveryPassUserNodemailerRepository) {}

  public async execute(email: string, token: string): Promise<boolean> {
    const res = await this.userRepo.recoverPassUser(email, token);
    return res;
  }
}