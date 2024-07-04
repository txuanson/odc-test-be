import { z } from "zod";
import { TaskStatus } from "../constants";

export const CreateTaskSchema = {
  body: z.object({
    name: z.string().min(1).max(80),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  })
};

export const UpdateTaskSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    name: z.string().min(3).max(80).optional(),
    startDate: z.coerce.date().optional().nullable(),
    endDate: z.coerce.date().optional().nullable(),
    status: z.string().optional(),
  })
};

export const DeleteTaskSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
};

export const GetTaskSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
};

export const SearchTasksSchema = {
  query: z.object({
    name: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
  })
};