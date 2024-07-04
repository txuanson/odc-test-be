import { FindOperator } from "typeorm";

export function optionalCriteria<T>(
  target: T | undefined,
  criteria: FindOperator<T>,
) {
  return target ? criteria : undefined;
}