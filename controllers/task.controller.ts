import { Request, Response } from "express";
import { TaskRepository } from "../repositories";
import { BaseController } from "../abstraction/base-controller.abstraction";
import { catchAsync } from "../utils";
import { CreateTaskSchema, DeleteTaskSchema, GetTaskSchema, SearchTasksSchema, UpdateTaskSchema } from "../schemas";
import { z } from "zod";
import { BadRequestError, NotFoundError } from "../constants";
import { validateMiddleware } from "../middlewares";
import { format } from "date-fns";
import { Task } from "../entities";
import { Nullable } from "../types";

export class TaskController extends BaseController {
  public path: string = "/tasks";
  public name: string = TaskController.name;
  private repository: TaskRepository;

  constructor() {
    super();
    this.repository = new TaskRepository();
  }

  initializeRoutes(): void {
    this.router
      .route("/")
      .get(validateMiddleware(SearchTasksSchema), this.search)
      .post(validateMiddleware(CreateTaskSchema), this.create);
    this.router
      .route("/:id")
      .get(validateMiddleware(GetTaskSchema), this.findById)
      .patch(validateMiddleware(UpdateTaskSchema), this.update)
      .delete(validateMiddleware(DeleteTaskSchema), this.delete);
  } 

  create = catchAsync(async (
    req: Request<never, Task, z.infer<typeof CreateTaskSchema["body"]>>, 
    res: Response
  ) => {
    this.validateTaskDates(req.body.startDate, req.body.endDate);
    const newTask = await this.repository.create({
      ...req.body,
      startDate: this.optionalFormatDate(req.body.startDate),
      endDate: this.optionalFormatDate(req.body.endDate)
    });
    res.status(201).send(newTask);
  });

  update = catchAsync(async (
    req: Request<z.infer<typeof UpdateTaskSchema["params"]>, never, z.infer<typeof UpdateTaskSchema["body"]>>, 
    res: Response
  ) => {
    const { id } = req.params;
    this.validateTaskDates(req.body.startDate, req.body.endDate);
  
    await this.repository.update(id, {
      ...req.body,
      startDate: this.optionalFormatDate(req.body.startDate),
      endDate: this.optionalFormatDate(req.body.endDate)
    });

    res.status(204).send();
  });

  delete = catchAsync(async (
    req: Request<z.infer<typeof DeleteTaskSchema["params"]>>, 
    res: Response
  ) => {
    const { id } = req.params;
    await this.repository.delete(id);
    res.status(204).send();
  });

  findById = catchAsync(async (
    req: Request<z.infer<typeof GetTaskSchema["params"]>>, 
    res: Response
  ) => {
    const { id } = req.params;
    const task = await this.repository.findById(id);
    if (!task) {
      throw new NotFoundError("Task not found");
    }
    res.status(200).send(task);
  });

  search = catchAsync(async (
    req: Request<never, Task[], never, z.infer<typeof SearchTasksSchema["query"]>>, 
    res: Response
  ) => {
    const query = req.query;
    const tasks = await this.repository.search(query);
    res.status(200).send(tasks);  
  });

  private validateTaskDates = (startDate?: Nullable<Date>, endDate?: Nullable<Date>) => {
    if(endDate && !startDate) {
      throw new BadRequestError("Start date is required when end date is provided");
    }

    if(startDate && endDate && startDate >= endDate) {
      throw new BadRequestError("End date must be greater than start date");
    }
  }

  private optionalFormatDate = (date?: Nullable<Date>) =>  {
    if (date === null) {
      return null;
    }

    return date ? format(date, "yyyy-MM-dd") : undefined;
  }
}