import { Context, StructureNode } from "../types";
import { DIRS } from "./config";
import { columnsTemplate } from "./templates/list/columns.template";
import { dataTableTemplate } from "./templates/list/data-table.template";
import { dataTableIndexTemplate } from "./templates/list/list-index.template";
import { createFormTemplate } from "./templates/mutation/create-form.template";
import { formButtonTemplate } from "./templates/mutation/form-button.template";
import { formIndexTemplate } from "./templates/mutation/mutation-index.template";
import { updateFormTemplate } from "./templates/mutation/update-form.template";
import { detailsPageTemplate } from "./templates/pages/details-page.template";
import { listPageTemplate } from "./templates/pages/list-page.template";
import { translationsHookTemplate } from "./templates/translations/translation-hooks.template";
import { translationsIndexTemplate } from "./templates/translations/translation-index.template";
import { featureMessagesTypeTemplate } from "./templates/translations/translation-messages-types.template";
import { messagesJsonContent } from "./templates/translations/translation-messages.template";

export const createFeatureStructure = (ctx: Context): StructureNode => ({
  name: ctx.kebabCase,
  type: "dir",
  children: [
    {
      name: DIRS.mutation,
      type: "dir",
      children: [
        {
          name: `create-${ctx.kebabCase}-form.tsx`,
          type: "file",
          generate: () => createFormTemplate(ctx),
        },
        {
          name: `update-${ctx.kebabCase}-form.tsx`,
          type: "file",
          generate: () => updateFormTemplate(ctx),
        },
        {
          name: `${ctx.kebabCase}-form-button.tsx`,
          type: "file",
          generate: () => formButtonTemplate(ctx),
        },
        {
          name: `index.ts`,
          type: "file",
          generate: () => formIndexTemplate(ctx),
        },
      ],
    },
    {
      name: DIRS.translations,
      type: "dir",
      children: [
        {
          name: DIRS.hooks,
          type: "dir",
          children: [
            {
              name: `use-${ctx.kebabCase}-translations.ts`,
              type: "file",
              generate: () => translationsHookTemplate(ctx),
            },
          ],
        },
        {
          name: DIRS.messages,
          type: "dir",
          children: [
            {
              name: "en.json",
              type: "file",
              generate: () => messagesJsonContent({ ...ctx, lang: "en" }),
            },
            {
              name: "ar.json",
              type: "file",
              generate: () => messagesJsonContent({ ...ctx, lang: "ar" }),
            },
            {
              name: `${ctx.featurePascal}Messages.ts`,
              type: "file",
              generate: () => featureMessagesTypeTemplate(ctx),
            },
          ],
        },
        {
          name: "index.ts",
          type: "file",
          generate: () => translationsIndexTemplate(ctx),
        },
      ],
    },
    {
      name: DIRS.list,
      type: "dir",
      children: [
        {
          name: `${ctx.kebabCase}-columns.tsx`,
          type: "file",
          generate: () => columnsTemplate(ctx),
        },
        {
          name: `${ctx.kebabCase}-data-table.tsx`,
          type: "file",
          generate: () => dataTableTemplate(ctx),
        },
        {
          name: "index.ts",
          type: "file",
          generate: () => dataTableIndexTemplate(ctx),
        },
      ],
    },
    {
      name: "index.ts",
      type: "file",
      generate: () => `export * from "./${DIRS.mutation}";
export * from "./${DIRS.translations}";
export * from "./${DIRS.list}";
`,
    },
  ],
});

export const createModulePagesStructure = (ctx: Context): StructureNode => ({
  name: ctx.pluralKebabCase,
  type: "dir",
  children: [
    {
      name: `[${ctx.featureCamel}Id]`,
      type: "dir",
      children: [
        {
          name: `page.tsx`,
          type: "file",
          generate: () => detailsPageTemplate(ctx),
        },
      ],
    },

    {
      name: "page.tsx",
      type: "file",
      generate: () => listPageTemplate(ctx),
    },
  ],
});
