# Todo App

## Description

This is a Todo application designed to help users manage their tasks efficiently. Built with Node.js and Express, it leverages a SQLite database for storage and includes a Swagger UI for API documentation.

## Features

- Task management: Create, update, delete, and search tasks.
- Fully documented apis with Swagger UI, able to **test the api directly from the browser**.
- Environment-specific configurations using dotenv.
- Request validation with Zod and custom middleware.
- Out-of-the-box error handling with catch-async wrapper, custom middleware and response builder.
- Unit tests with Jest.
- E2E tests with Supertest.
- TypeScript support.

## Scripts

### Install dependencies

```bash
yarn install
```

### Run the application in development mode

This will start the application with nodemon, also all the api error stack traces will be shown in the response.

```bash
yarn start:dev
```

### Run the application in production mode

This will start the application with node, also all the api error stack traces will be omitted from the response.

```bash
yarn build
yarn start
```

### Run the tests

```bash
yarn test
```