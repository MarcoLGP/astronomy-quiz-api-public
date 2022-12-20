import express, { Express } from "express";
import routes from "./routes/";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const app: Express = express();

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI || "MONGO_URI");

app.use(routes);

app.listen(8080);