import { Context, StructureNode } from "../types";
import { repositoryTemplate } from "./templates/repository.template";
import { schemasTemplate } from "./templates/shared/schemas.template";
import { typesTemplate } from "./templates/shared/types.templates";

export const createModuleSharedStructure = (ctx: Context): StructureNode => ({
  name: ctx.kebabCase,
  type: "dir",
  children: [
    {
      name: `schemas.ts`,
      type: "file",
      generate: () => schemasTemplate(ctx),
    },

    {
      name: "types.ts",
      type: "file",
      generate: () => typesTemplate(ctx),
    },
  ],
});

export const createModuleSharedIndexStructure = (
  ctx: Context,
): StructureNode => ({
  name: ctx.kebabCase,
  type: "dir",
  children: [
    {
      name: `schemas.ts`,
      type: "file",
      generate: () => schemasTemplate(ctx),
    },

    {
      name: "types.ts",
      type: "file",
      generate: () => typesTemplate(ctx),
    },
  ],
});

export const createModuleStructure = (ctx: Context): StructureNode => ({
  name: ctx.kebabCase,
  type: "dir",
  children: [
    {
      name: `repositories`,
      type: "dir",
      children: [
        {
          name: `${ctx.kebabCase}.repository.ts`,
          type: "file",
          generate: () => repositoryTemplate(ctx),
        },
      ],
    },
  ],
});
