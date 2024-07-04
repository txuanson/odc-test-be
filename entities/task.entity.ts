import { TaskStatus } from "../constants";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { Nullable } from "../types";

@Entity({ name: "tasks" })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("idx_task_name")
  @Column({
    type: "varchar",
    length: 80,
  })
  name: string;

  @Index("idx_task_start_date")
  @Column({
    nullable: true,
    type: "varchar",
    length: 10,
  })
  startDate?: Nullable<string>;

  @Index("idx_task_end_date")
  @Column({
    nullable: true,
    type: "varchar",
    length: 10,
  })
  endDate?: Nullable<string>;

  @Index("idx_task_status")
  @Column({
    default: TaskStatus.TODO,
  })
  status: string;

  @Index("idx_task_created_at")
  @Column({
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt?: string;

  @Index("idx_task_modified_at")
  @Column({
    nullable: true,
  })
  modifiedAt?: string;
}