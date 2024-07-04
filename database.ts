import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  entities: [ __dirname + "/entities/*.entity.ts"],
  synchronize: true,
});

export { AppDataSource };