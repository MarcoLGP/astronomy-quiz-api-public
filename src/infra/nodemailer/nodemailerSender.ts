import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

export class NodemailerSender {
    private pass: string;

    constructor() {
        this.pass = process.env.NODEMAILER_EMAIL_PASS || "PASS";
    }

    public async  sendEmail(email: string, token: string): Promise<boolean> {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "astronomyquizapp@gmail.com",
                pass: this.pass
            }
        });
        const mailOptions = {
            from: "astronomyquizapp@gmail.com",
            to: email,
            subject: "Recuperação de senha",
            text: `Para alterar a sua senha clique no link: ${process.env.BASE_URL}/recoveryPass/${token}`,
            html: `<span>Para alterar a sua senha clique no link: ${process.env.BASE_URL}/recoveryPass/${token}</span>`
        };

        const res = await transporter.sendMail(mailOptions);

        if (res.rejected.length > 0) {
            return false;
        } else {
            return true;
        }

    }
}