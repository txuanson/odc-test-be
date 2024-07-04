import { Repository, ObjectLiteral, DataSource } from "typeorm";

export const initTaskData = async <T extends ObjectLiteral>(taskRepository: Repository<T>, data: Array<T>) => {
  await taskRepository.save(data);
}

export const newDataSources = () => {
  const AppDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    entities: [ __dirname + "/entities/*.entity.ts"],
    synchronize: true,
  });

  return AppDataSource;
}