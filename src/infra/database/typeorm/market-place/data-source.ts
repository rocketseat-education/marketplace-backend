import "reflect-metadata";
import { DataSource } from "typeorm";
import path = require("path");

export const MarketPlaceDataSource = new DataSource({
  type: "sqlite",
  database: path.resolve(__dirname, "./database.sqlite"),
  synchronize: false,
  logging: false,
  entities: [path.resolve(__dirname, "entities", "*.{ts,js}")],
  migrations: [path.resolve(__dirname, "migrations", "*.{ts,js}")],
  subscribers: [],
});
