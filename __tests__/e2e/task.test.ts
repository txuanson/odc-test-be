import request from "supertest";
import { default as App } from "../../app";
import { TaskController } from "../../controllers";
import { AppDataSource } from "../../database";
import { initTaskData } from "../utils";
import { Task } from "../../entities";
import sampleData from "../sample/tasks.json";

describe("Tasks E2E", () => {
  let app: App;
  const controllers = [new TaskController()];
  
  beforeEach(async () => {
    app = new App(controllers, 8081, AppDataSource);
    // Disable logger
    app.logger.silent = true;
    await app.init();
    app.listen();
  });

  afterEach(async () => {
    await app.close();
  });

  it("POST /tasks should create new task", async () => {
    const response = await request(app.app)
      .post("/tasks")
      .send({ name: "New Task",});

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toEqual(expect.objectContaining({ name: "New Task" }));
  });

  it("POST /tasks should return 400 if invalid task data type", async () => {
    const response = await request(app.app)
      .post("/tasks")
      .send({ name: "N" , startDate: "not a date", endDate: "not a date", status: "invalid"});

    expect(response.status).toBe(400);
  });

  it("POST /tasks should return 400 if endDate exists but startDate not", async () => {
    const response = await request(app.app)
      .post("/tasks")
      .send({ name: "New Task", endDate: "2021-01-01" });

    expect(response.status).toBe(400);
  });

  it("POST /tasks should return 201 if startDate exists but endDate not", async () => {
    const response = await request(app.app)
      .post("/tasks")
      .send({ name: "New Task", startDate: "2021-01-01" });

    expect(response.status).toBe(201);
  });

  it("PATCH /tasks/:id should update task", async () => {
    await initTaskData(AppDataSource.getRepository(Task), sampleData);
    const response = await request(app.app)
      .patch("/tasks/1")
      .send({ name: "Updated Task" });

    expect(response.status).toBe(204);
  });

  it("PATCH /tasks/:id should return 400 if invalid task data type", async () => {
    const response = await request(app.app)
      .patch("/tasks/1")
      .send({ name: "N" , startDate: "not a date", endDate: "not a date", status: "invalid"});

    expect(response.status).toBe(400);
  });

  it("PATCH /tasks/:id should return 400 if endDate exists but startDate not", async () => {
    const response = await request(app.app)
      .patch("/tasks/1")
      .send({ name: "Updated Task", endDate: "2021-01-01" });

    expect(response.status).toBe(400);
  });

  it("PATCH /tasks/:id should return 204 if startDate exists but endDate not", async () => {
    await initTaskData(AppDataSource.getRepository(Task), sampleData);
    const response = await request(app.app)
      .patch("/tasks/1")
      .send({ name: "Updated Task", startDate: "2021-01-01" });

    expect(response.status).toBe(204);
  });

  it("DELETE /tasks/:id should delete task", async () => {
    const repository = AppDataSource.getRepository(Task);
    await initTaskData(repository, sampleData);
    const response = await request(app.app)
      .delete("/tasks/1");

    const task = await repository.findOne({
      where: { id: 1 }
    });
    
    expect(task).toBeNull();
    expect(response.status).toBe(204);
  });
  
  it("GET /tasks should return all tasks", async () => {
    await initTaskData(AppDataSource.getRepository(Task), sampleData);
    const response = await request(app.app)
      .get("/tasks");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(3);
    expect(response.body).toEqual(
      expect.arrayContaining(
        sampleData.map(
          (task) => expect.objectContaining(task)
        )
      )
    );
  });

  it("GET /tasks should return tasks filtered by name and status", async () => {
    await initTaskData(AppDataSource.getRepository(Task), sampleData);
    const response = await request(app.app)
      .get("/tasks")
      .query({ name: "Task 1", status: "TODO"});

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual(
      expect.arrayContaining(
        sampleData.filter((task) => task.name === "Task 1")
      )
    );
  })

  it("GET /tasks should throw 400 if invalid query params", async () => {
    await initTaskData(AppDataSource.getRepository(Task), sampleData);
    const response = await request(app.app)
      .get("/tasks")
      .query({ status: "invalid" });

    expect(response.status).toBe(400);
  })

  it("GET /tasks/:id should return task by id", async () => {
    await initTaskData(AppDataSource.getRepository(Task), sampleData);
    const response = await request(app.app)
      .get("/tasks/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(sampleData[0]));
  });

  it("GET /tasks/:id should return 404 if task not found", async () => {
    const response = await request(app.app)
      .get("/tasks/1");

    expect(response.status).toBe(404);
  });


});