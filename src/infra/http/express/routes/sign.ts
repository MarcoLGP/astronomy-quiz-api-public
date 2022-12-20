import { GetAllUsersPostgresRepository } from "./../../../../application/get-all-users-postgres.use-case";
import { SocialSignJWT } from "./../../../jsonwebtoken/socialSignJsonWebToken";
import { userFromJWT } from "./../../../jsonwebtoken/userJsonWebToken";
import { GetUserByEmailPostgresRepository } from "../../../../application/get-user-by-email-postgres-use-case";
import { GetUserByEmailUseCase } from "../../../../application/get-user-by-email-use-case";
import { Cryptography } from "../../../../domain/cryptography";
import { CreateUserUseCase } from "../../../../application/create-user.use-case";
import { CreateUserPostgresRepository } from "../../../../application/create-user-postgres.use-case";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { GetAllUsersUseCase } from "../../../../application/get-all-users.use-case";
dotenv.config();

const router = Router();

const jwtSecret: string = process.env.JWT_SECRET || "secret";
const cryptographyInstance = new Cryptography();
const postgresGetUserByEmailRepo = new GetUserByEmailPostgresRepository();
const getUserByEmailUseCase = new GetUserByEmailUseCase(postgresGetUserByEmailRepo);

router.post("/signUp", async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    res.status(422).json({ status: "Missing required param(s)" });
  } else {
    const user_found = await getUserByEmailUseCase.execute(email);
    if (user_found) {
      res.status(409).json({ status: "e-mail used" });
    } else {
      const postgresCreateUserRepo = new CreateUserPostgresRepository();
      const createUseCase = new CreateUserUseCase(postgresCreateUserRepo);
      const passHashed = cryptographyInstance.encrypt(password);
      const output = await createUseCase.execute({name, email, password: passHashed, level: 1});
      const token = cryptographyInstance.encrypt(jwt.sign(output, jwtSecret, { expiresIn: "3d" }));
      res.status(201).json({ token });
    }
  }
});

router.post("/signIn", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ status: "Missing required param(s)" });
  } else {
    const user_found = await getUserByEmailUseCase.execute(email);
    if (user_found && user_found.password) {
      const res_password_check = await cryptographyInstance.compare(
        user_found.password,
        password
      );
      if (res_password_check) {
        const token = cryptographyInstance.encrypt(jwt.sign(user_found, jwtSecret, { expiresIn: "3d" }));
        res.status(200).json({ token });
      } else {
        res.status(403).json({ status: "bad credentials" });
      }
    } else {
      res.status(404).json({ status: "user not found" });
    }
  }
});

router.post("/getUser", async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    res.status(422).json({ status: "Missing required param(s)" });
  } else {
    let decrypted_token: string | undefined;
    try {
      decrypted_token = cryptographyInstance.decrypt(token);
    } catch (error) {
      res.status(498).json({ status: "Invalid token" });
    }
    if (decrypted_token) userFromJWT(decrypted_token)
      .then((user) => {
        res.status(200).json({ user });
      })
      .catch((err) => {
        res.status(400).json({ status: "error in token " + err });
      });
  }
});

router.post("/getUserSocial", async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    res.status(422).json({ status: "Missing required param(s)" });
  } else {
    let decrypted_token: string | undefined;
    try {
      decrypted_token = cryptographyInstance.decrypt(token);
    } catch (error) {
      res.status(498).json({ status: "Invalid token" });
    }
    if (decrypted_token) SocialSignJWT(decrypted_token)
    .then(async (socialSignJwtRes) => {
        if (socialSignJwtRes) {
          const user_found = await getUserByEmailUseCase.execute(socialSignJwtRes?.email);
          if (user_found && user_found.providerSocialSign === socialSignJwtRes.provider) {
            const tokenUser = cryptographyInstance.encrypt(jwt.sign(user_found, jwtSecret, { expiresIn: "3d" }));
            res.status(200).json({ token: tokenUser });
          } else if (!user_found) {
            const postgresCreateUserRepo = new CreateUserPostgresRepository();
            const createUseCase = new CreateUserUseCase(postgresCreateUserRepo);
            const output = await createUseCase.execute({name: socialSignJwtRes.name, email: socialSignJwtRes.email, level: 1, providerSocialSign: socialSignJwtRes.provider});
            const tokenNewUserRegistred = cryptographyInstance.encrypt(
              jwt.sign(output, jwtSecret, { expiresIn: "3d" })
            );
            res.status(201).json({ token: tokenNewUserRegistred });
          } else if (user_found && user_found.providerSocialSign !== socialSignJwtRes.provider) {
            res.status(403).json({ status: "user registred from another social provider" });
          } else {
            res.status(500).json({ status: "internal server error" });
          }
        } else {
          res.status(500).json({ status: "internal server error" });
        }
      }
    );
  }
});

router.get("/getAllUsers", async (req: Request, res: Response) => {
  const postgresGetAllUsersRepo = new GetAllUsersPostgresRepository();
  const getAllUsersUseCase = new GetAllUsersUseCase(postgresGetAllUsersRepo);
  const users = await getAllUsersUseCase.execute();
  res.status(200).json({ users });
});

export default router;
