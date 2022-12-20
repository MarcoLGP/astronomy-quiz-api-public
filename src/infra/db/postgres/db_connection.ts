import {Sequelize} from "sequelize";
import * as pg from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_URI || "POSTGRES_URI", {
    dialect: "postgres",
    dialectModule: pg
});

export {sequelize};