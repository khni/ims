import { creationLimitExceeded, fail } from "@avuny/utils";
import { Context, Resource } from "./types.js";

export const checkCount = async <T, E>(params: {
  data: T;
  id?: string;
  countChecker?: {
    keys: (keyof T)[];
    errorKey?: E;
  }[];
  context: Context;
  repository: {
    count: (params: { where: Record<string, any> }) => Promise<number>;
  };
  config: {
    creationLimit: number;
    moduleName: Resource;
  };
}) => {
  const { data, countChecker, id, context, repository, config } = params;

  if (!countChecker?.length) return null;

  for (const rule of countChecker) {
    const where: Record<string, any> = {};

    for (const key of rule.keys) {
      const k = key as keyof T;
      where[k as string] = data[k];
    }

    const hasAll = rule.keys.every((k) => data[k as keyof T] !== undefined);
    if (!hasAll) continue;

    const recordsCount = await repository.count({ where });

    if (recordsCount >= config.creationLimit) {
      return creationLimitExceeded(
        context,
        `${config.moduleName}CreateService.create`,
      );
    }
  }

  return null;
};
