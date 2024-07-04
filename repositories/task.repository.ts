import { Like, Raw, Repository } from "typeorm";
import { Task } from "../entities";
import { AppDataSource } from "../database";
import { z } from "zod";
import { SearchTasksSchema } from "../schemas";
import { optionalCriteria } from "../utils";
import { format } from "date-fns";
import { NotFoundError } from "../constants";

export class TaskRepository {
  private repository: Repository<Task>;

  constructor() {
    this.repository = AppDataSource.getRepository(Task);
  }

  create(task: Omit<Task, "id">) {
    return this.repository.save(task);
  }

  async update(id: number, task: Partial<Omit<Task, "id">>) {
    const existingTask = await this.repository.findOne({
      select: ["id"],
      where: { id },
    });
    if (!existingTask) {
      throw new NotFoundError("Task not found");
    }
    
    return this.repository.update(id, {
      ...task,
      modifiedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    });
  }

  delete(id: number) {
    return this.repository.delete(id);
  }

  findById(id: number) {
    return this.repository.findOne({
      where: { id },
    });
  }

  search(condition: z.infer<typeof SearchTasksSchema["query"]>) {
    return this.repository.find({
      where: {
        name: optionalCriteria(condition.name, Like(`%${condition.name}%`)),
        status: condition.status,
      },
    });
  }
}