import { fail } from "@avuny/utils";

export const checkUnique = async <T, E>(params: {
  data: T;
  id?: string;
  uniqueChecker?: {
    keys: (keyof T)[];
    errorKey: E;
  }[];
  context: { userId: string; requestId: string };
  repository: {
    find: (params: {
      where: Record<string, any>;
    }) => Promise<{ id: string } | null>;
  };
  config: {
    moduleName: string;
    action: "create" | "update";
  };
}) => {
  const { data, uniqueChecker, id, context, repository, config } = params;

  if (!uniqueChecker?.length) return null;

  for (const rule of uniqueChecker) {
    const where: Record<string, any> = {};

    for (const key of rule.keys) {
      const k = key as keyof T;
      where[k as string] = data[k];
    }

    const hasAll = rule.keys.every((k) => data[k as keyof T] !== undefined);
    if (!hasAll) continue;

    const existing = await repository.find({ where });

    if (!existing) continue;
    if (id && existing.id === id) continue;

    return fail(
      rule.errorKey,
      context,
      `${config.moduleName}${config.action === "create" ? "CreateService" : "UpdateService"}.unique`,
    );
  }

  return null;
};
