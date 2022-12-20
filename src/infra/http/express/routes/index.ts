import {
  json,
  NextFunction,
  Request,
  Response,
  Router,
  urlencoded,
} from "express";
import * as dotenv from "dotenv";
dotenv.config();
import signRoutes from "./sign";
import handleUserRouter from "./handleUser";
import cors from "cors";

const router = Router();

router.use(json());
router.use(cors());
router.use((req: Request, res: Response, next: NextFunction) => {
  const key = req.header("key");
  if (!key) {
    res.status(422).json({ status: "Missing required param(s)" });
  } else {
    if (key === process.env.API_KEY) {
      next();
    } else {
      res.status(403).json({ status: "Invalid key" });
    }
  }
});
router.use(urlencoded({ extended: false }));
router.use(signRoutes);
router.use(handleUserRouter);

export default router;
