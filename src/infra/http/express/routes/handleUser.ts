import { InsertBlockedTokensUseCase } from "./../../../../application/create-blocked-token.use-case";
import { InsertBlockedTokensMongoRepository } from "./../../../../application/create-blocked-token-mongo.use-case";
import { GetAllBlockedTokensUseCase } from "./../../../../application/get-all-blocked-tokens.use-case";
import { GetAllBlockedTokensMongoRepository } from "./../../../../application/get-all-blocked-tokens-mongo.use-case";
import { ChangePassJWT } from "./../../../jsonwebtoken/changePassJsonWebToken";
import { UpdatePassUserUseCase } from "./../../../../application/update-pass-user.use-case";
import { UpdatePassUserPostgresRepository } from "./../../../../application/update-pass-user-postgres-use-case";
import { RecoveryPassUserUseCase } from "./../../../../application/recovery-pass-user.use-case";
import { RecoveryPassUserNodemailerRepository } from "./../../../../application/recovery-pass-user-nodemailer.use-case";
import { GetUserByEmailPostgresRepository } from "./../../../../application/get-user-by-email-postgres-use-case";
import { GetUserByEmailUseCase } from "./../../../../application/get-user-by-email-use-case";
import { NextLevelUserUseCase } from "./../../../../application/next-level-user.use-case";
import { NextLevelUserPostgresRepository } from "./../../../../application/next-level-user-postgres-use-case";
import * as dotenv from "dotenv";
import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Cryptography } from "../../../../domain/cryptography";
dotenv.config();

const router = Router();
const cryptographyInstance = new Cryptography();
const jwtToken = process.env.JWT_SECRET || "JWT_SECRET";

router.post("/updateLevelUser", async (req: Request, res: Response) => {
  const { id } = req.body;
  const decrypted_id = cryptographyInstance.decrypt(id);
  const postgresNextLevelUserRepo = new NextLevelUserPostgresRepository();
  const nextLevelUserUseCaseInstance = new NextLevelUserUseCase(postgresNextLevelUserRepo);
  const res_user = await nextLevelUserUseCaseInstance.execute(decrypted_id);
  if (res_user) {
    const token = cryptographyInstance.encrypt(
      jwt.sign(res_user, jwtToken, { expiresIn: "3d" })
    );
    res.status(200).json({ token });
  } else {
    res.status(404).json({ status: "user not found" });
  }
});

router.post("/recoveryPassGetToken", async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(422).json({ status: "Missing required param(s)" });
  } else {
    const postgresGetUserByEmailRepo = new GetUserByEmailPostgresRepository();
    const getUserByEmailUseCase = new GetUserByEmailUseCase(postgresGetUserByEmailRepo);
    const user_found = await getUserByEmailUseCase.execute(email);
    if (user_found) {
      if (!user_found.providerSocialSign) {
        const token = cryptographyInstance.encrypt(jwt.sign({ id: user_found.id }, jwtToken, { expiresIn: "24h" }));
        const recoveryPassUserNodemailerRepo = new RecoveryPassUserNodemailerRepository();
        new RecoveryPassUserUseCase(recoveryPassUserNodemailerRepo).execute(email, token)
          .then((success: boolean) => {
            if (success) {
              res.status(200).json({ status: "E-mail sended" });
            } else {
              res.status(502).json({ status: "Error when send e-mail" });
            }
          }).catch(() => {
            res.status(502).json({ status: "Error when send e-mail" });
          });
      } else {
        res.status(401).json({status: "User registred with social sign"});
      }
    } else {
      res.status(404).json({ status: "User not found" });
    }
  }
});

router.post("/checkTokenUserUpdatePass", (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    res.status(422).json({ status: "Missing required param(s)" });
  } else {
    let decrypted_token: string | undefined;
    try {
      decrypted_token = cryptographyInstance.decrypt(token);
    } catch (err) {
      res.status(498).json({ status: "Invalid token" });
    }
    if (decrypted_token) ChangePassJWT(decrypted_token)
      .then((user_id) => {
        if (user_id) {
          const getAllBlockedTokensMongoRepository = new GetAllBlockedTokensMongoRepository();
          const getAllBlockedTokensMongo = new GetAllBlockedTokensUseCase(getAllBlockedTokensMongoRepository);
          getAllBlockedTokensMongo.execute()
            .then((tokens) => {
              if (tokens) {
                let token_used;
                tokens.forEach((blocked_token) => {
                  if (blocked_token.token === decrypted_token) {
                    token_used = true;
                  }
                });
                if (token_used) {
                  res.status(401).json({ status: "token used" });
                } else {
                  res.status(200).json({ status: "Authorized" });
                }
              } else {
                res.status(200).json({ status: "Authorized" });
              }
            }).catch(() => res.status(500).json({ status: "Internal db error" }));
        } else {
          res.status(401).json({ status: "token expired" });
        }
      }).catch(() => res.status(401).json({ status: "token expired" }));
  }
});

router.post("/updateUserPass", (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!password || !token) {
    res.status(422).json({ status: "Missing required param(s)" });
  } else {
    let decrypted_token: string | undefined;
    try {
      decrypted_token = cryptographyInstance.decrypt(token);
    } catch (error) {
      res.status(498).json({ status: "Invalid token" });
    }
    if (decrypted_token) ChangePassJWT(decrypted_token)
      .then((idUser) => {
        if (idUser) {
          const postgresUpdatePassUserRepository = new UpdatePassUserPostgresRepository();
          const updatePassUser = new UpdatePassUserUseCase(postgresUpdatePassUserRepository);
          const hashedPass = cryptographyInstance.encrypt(password);
          updatePassUser.execute(idUser, hashedPass)
            .then((result) => {
              if (result) {
                const blackListTokensMongoRepository = new InsertBlockedTokensMongoRepository();
                const blackListTokensInsert = new InsertBlockedTokensUseCase(blackListTokensMongoRepository);
                if (decrypted_token) blackListTokensInsert.execute(decrypted_token)
                  .then((success: boolean) => {
                    if (success) res.status(200).json({ status: "Password updated" });
                    else res.status(500).json({ status: "Internal database error" });
                  });
              } else {
                res.status(500).json({ status: "Internal database error" });
              }
            })
            .catch(() => res.status(500).json({ status: "Internal database error" }));
        } else {
          res.status(401).json({ status: "expired token" });
        }
      });
    }
});

export default router;