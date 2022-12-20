import { NodemailerSender } from "../infra/nodemailer/nodemailerSender";
import { UserRepositoryInterface } from "../domain/repository/user.repository";

export class RecoveryPassUserNodemailerRepository implements UserRepositoryInterface {
    async recoverPassUser(email: string, token: string): Promise<boolean> {
        const res = await new NodemailerSender().sendEmail(email, token);
        return res;
    }
}