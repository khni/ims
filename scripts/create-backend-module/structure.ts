import { Context, StructureNode } from "../types";

import { errorCodeTemplate } from "./templates/errors/error-code.template";
import { errorMapTemplate } from "./templates/errors/error-map.template";
import { intlArTemplate } from "./templates/intl/locales/intl-ar.template";
import { intlEnTemplate } from "./templates/intl/locales/intl-en.template";
import { repositoryTemplate } from "./templates/repository.template";
import { serviceTemplate } from "./templates/service.template";
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
    {
      name: `errors`,
      type: "dir",
      children: [
        {
          name: `${ctx.kebabCase}.error-code.ts`,
          type: "file",
          generate: () => errorCodeTemplate(ctx),
        },
        {
          name: `${ctx.kebabCase}.error-map.ts`,
          type: "file",
          generate: () => errorMapTemplate(ctx),
        },
      ],
    },
    {
      name: `services`,
      type: "dir",
      children: [
        {
          name: `${ctx.kebabCase}.service.ts`,
          type: "file",
          generate: () => serviceTemplate(ctx),
        },
      ],
    },
  ],
});

export const createModuleLocaleStructure = (ctx: Context): StructureNode => ({
  name: ctx.kebabCase, //module name as folder
  type: "dir",
  children: [
    {
      name: `en.json`,
      type: "file",
      generate: () => intlEnTemplate(),
    },
    {
      name: `ar.json`,
      type: "file",
      generate: () => intlArTemplate(),
    },
  ],
});

export const createModuleIntlStructure = (ctx: Context): StructureNode => ({
  name: ctx.kebabCase, //intl
  type: "dir",
  children: [
    {
      name: `i18next.d.ts`,
      type: "file",
      generate: () => intlEnTemplate(),
    },
    {
      name: `i18next.ts`,
      type: "file",
      generate: () => intlArTemplate(),
    },
    {
      name: `trans.ts`,
      type: "file",
      generate: () => intlArTemplate(),
    },
  ],
});
