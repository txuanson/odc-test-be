import type {Config} from 'jest';

const config: Config = {
  preset: 'ts-jest',
  logHeapUsage: true,
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export default config;