#!/usr/bin/env tsx

// import { generateFeature } from "./generator";

// const args = process.argv.slice(2);

// const name = args[0];
// const force = args.includes("--force");
// const dryRun = args.includes("--dry-run");

// if (!name) {
//   console.error("❌ Feature name required");
//   process.exit(1);
// }

// generateFeature(name, { force, dryRun }).catch((e) => {
//   console.error(e);
//   process.exit(1);
// });

// #!/usr/bin/env tsx
/**
 *
 *
 * Usage:
 *   pnpm tsx /scripts/create-web-feature/index.ts <name> [--force] [--dry-run]
 *
 * Features:
 * - Single source of truth for directory names (DIRS)
 * - Creates feature structure (mutation, translations, messages, hooks, list)
 * - Adds a feature-specific messages type file in translations/messages:
 *     <FeaturePascal>Messages.ts
 *   with:
 *     import roleMessages from "./en.json";
 *     export type RoleMessages = typeof roleMessages;
 *     export const RoleMessages: RoleMessages = { ...roleMessages };
 * - Regenerates two central files (keeps imports in sync):
 *     src/i18n/request.ts         <-- server dynamic loader for locales
 *     src/messages/types.ts          <-- en.json aggregator and Messages type
 * - Safe-by-default: won't overwrite files unless --force
 * - --dry-run prints actions
 *
 * NOTE: This script assumes:
 *  - project root contains "src/features" and "src/messages/common/en.json"
 *  - your project's runtime supports dynamic import of JSON as `.default`
 */

import fs from "fs/promises";
import path from "path";

type Options = { force: boolean; dryRun: boolean };

const ROOT = path.resolve(__dirname, "../../");
const WEB_ROOT = path.join(ROOT, "apps/web");
const WEB_SRC = path.join(WEB_ROOT, "src");
const FEATURES_DIR = path.join(WEB_SRC, "features");
const MESSAGES_ROOT = path.join(WEB_ROOT, "messages"); // for common messages aggregator

/* ---------------------------- Config (single source) ---------------------------- */
/** rename these keys to change folder names globally */
const DIRS = {
  mutation: "mutation", // change to "form" if you prefer
  translations: "translations",
  messages: "messages",
  hooks: "hooks",
  list: "list", // change to "table" if you prefer
} as const;

/* ------------------------------- Helpers ---------------------------------- */

const capitalize = (value: unknown): string => {
  if (typeof value !== "string" || value.length === 0) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const toCamelCase = (input: unknown): string => {
  if (typeof input !== "string") {
    throw new Error("Feature name must be a string");
  }

  const parts = input
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(/\s+/);

  if (parts.length === 0) return "";

  return parts[0]!.toLowerCase() + parts.slice(1).map(capitalize).join("");
};

const toPascalCase = (input: unknown): string => {
  if (typeof input !== "string") {
    throw new Error("Feature name must be a string");
  }

  return input
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(/\s+/)
    .map(capitalize)
    .join("");
};

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function fileExists(fp: string) {
  try {
    await fs.access(fp);
    return true;
  } catch {
    return false;
  }
}

async function writeIfNeeded(fp: string, content: string, opts: Options) {
  const exists = await fileExists(fp);
  if (exists && !opts.force) {
    console.log(`⏭ skipped (exists): ${path.relative(ROOT, fp)}`);
    return;
  }
  if (opts.dryRun) {
    console.log(
      `${exists ? "overwrite (dry-run):" : "create (dry-run):"} ${path.relative(ROOT, fp)}`,
    );
    return;
  }
  await fs.writeFile(fp, content, "utf8");
  console.log(
    `${exists ? "OVERWRITTEN:" : "created:"} ${path.relative(ROOT, fp)}`,
  );
}

/* --------------------------- Templates & Generators ------------------------ */

/* DetailsForm template (PascalCase filename & default export) */
function detailsFormTemplate(featureCamel: string, featurePascal: string) {
  return `// ${featurePascal}DetailsForm.tsx
"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";
import { Form as CustomForm, FormProps } from "@/src/components/form";
import { mutate${featurePascal}Schema as schema } from "@avuny/shared";
import { use${featurePascal}Translations } from "@/src/features/${featureCamel}/${DIRS.translations}/${DIRS.hooks}/use${featurePascal}Translations";

export type ${featurePascal}FormDetailsProps<E, S extends string> = {
  ${featureCamel}?: z.infer<typeof schema>;
  customForm: Omit<FormProps<z.infer<typeof schema>, E, S>, "form" | "fields">;
};

export default function ${featurePascal}DetailsForm<E, S extends string>({
  ${featureCamel},
  customForm,
}: ${featurePascal}FormDetailsProps<E, S>) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (${featureCamel}) form.reset(${featureCamel});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [${featureCamel}]);

  const { ${featureCamel}FormFieldsTranslations } = use${featurePascal}Translations();

  return (
    <CustomForm
      form={form}
      getLabel={${featureCamel}FormFieldsTranslations}
      resourceName="${featureCamel}"
      actionName={${featureCamel} ? "update" : "create"}
      fields={[
        { key: "name", content: { name: "name", type: "text" }, spans: { base: 4, md: 2 } },
        { key: "description", content: { name: "description", type: "text" }, spans: { base: 4, md: 2 } },
      ]}
      {...customForm}
    />
  );
}
`;
}

function createFormTemplate(featurePascal: string) {
  return `// Create${featurePascal}Form.tsx
"use client";
import React from "react";
import { useCreate${featurePascal} } from "@/src/api";
import ${featurePascal}DetailsForm from "./${featurePascal}DetailsForm";

export const Create${featurePascal}Form: React.FC = () => {
  const { mutateAsync, isPending, error } = useCreate${featurePascal}();
  return (
    <div>
      <${featurePascal}DetailsForm
        customForm={{
          api: { onSubmit: async (data) => await mutateAsync({ data }), isLoading: isPending },
          error,
        }}
      />
    </div>
  );
};
`;
}

function updateFormTemplate(featureCamel: string, featurePascal: string) {
  return `// Update${featurePascal}Form.tsx
"use client";
import React from "react";
import { useUpdate${featurePascal} } from "@/src/api";
import { Get${featurePascal}ByIdResponse } from "@avuny/shared";
import ${featurePascal}DetailsForm from "./${featurePascal}DetailsForm";

export const Update${featurePascal}Form: React.FC<{ ${featureCamel}: Get${featurePascal}ByIdResponse }> = ({ ${featureCamel} }) => {
  const { mutateAsync, isPending, error } = useUpdate${featurePascal}();

  return (
    <div>
      <${featurePascal}DetailsForm
        ${featureCamel}={${featureCamel}}
        customForm={{
          api: { onSubmit: async (data) => mutateAsync({ data: data, id: ${featureCamel}.id }), isLoading: isPending },
          error,
        }}
      />
    </div>
  );
};
`;
}

function formButtonTemplate(featureCamel: string, featurePascal: string) {
  return `// ${featurePascal}FormButton.tsx
"use client";
import React, { useState } from "react";
import { Modal } from "@workspace/ui/blocks/modal";
import ActionButton from "@workspace/ui/blocks/buttons/action-btn";
import { useCommonTranslations } from "@/messages/common";
import { Get${featurePascal}ByIdResponse } from "@avuny/shared";
import { Create${featurePascal}Form } from "./Create${featurePascal}Form";
import { Update${featurePascal}Form } from "./Update${featurePascal}Form";

export const ${featurePascal}FormButton: React.FC<{ ${featureCamel}?: Get${featurePascal}ByIdResponse }> = ({ ${featureCamel} }) => {
  const [open, setOpen] = useState(false);
  const { actionTranslations } = useCommonTranslations();
  const add = actionTranslations("add");
  const edit = actionTranslations("edit");

  return (
    <div>
      <Modal
        trigger={
          <ActionButton
            type={${featureCamel} ? "edit" : "add"}
            onClick={() => setOpen(true)}
            title={${featureCamel} ? edit : add}
          />
        }
        open={open}
        onOpenChange={setOpen}
      >
        {${featureCamel} ? <Update${featurePascal}Form ${featureCamel}={${featureCamel}} /> : <Create${featurePascal}Form />}
      </Modal>
    </div>
  );
};
`;
}

/* translations hook */
function translationsHookTemplate(featureCamel: string, featurePascal: string) {
  return `// use${featurePascal}Translations.ts
import { useTranslations } from "next-intl";

export const use${featurePascal}Translations = () => {
  const ${featureCamel}FormTranslations = useTranslations("${featureCamel}.form");
  const ${featureCamel}FormFieldsTranslations = useTranslations("${featureCamel}.form.fields");
  const ${featureCamel}HeaderTranslations = useTranslations("${featureCamel}.headers");
  const ${featureCamel}ColumnHeaderTranslations = useTranslations("${featureCamel}.columnHeaders");

  return {
    ${featureCamel}FormTranslations,
    ${featureCamel}FormFieldsTranslations,
    ${featureCamel}HeaderTranslations,
    ${featureCamel}ColumnHeaderTranslations,
  };
};
`;
}

/* list templates */
function columnsTemplate(featurePascal: string) {
  return `// Columns.tsx
"use client";
import type { ${featurePascal}ListResponse } from "@avuny/shared";
import { createColumns } from "@workspace/ui/blocks/data-table/custom-columns";

export const ${featurePascal}Columns = ({ getHeader }: { getHeader: any }) =>
  createColumns<${featurePascal}ListResponse[number]>({
    columns: [{ key: "name" }, { key: "description" }],
    getHeader,
  });
`;
}

function dataTableTemplate(featureCamel: string, featurePascal: string) {
  return `// DataTable.tsx
"use client";
import React from "react";
import { use${featurePascal}List } from "@/src/api";
import type { ${featurePascal}ListResponse } from "@avuny/shared";
import { ${featurePascal}Columns } from "./Columns";
import { DataTable } from "@workspace/ui/blocks/data-table";
import { useTranslations } from "next-intl";

export const ${featurePascal}DataTable: React.FC = () => {
  const ${featureCamel}ColumnHeaderTranslations = useTranslations("${featureCamel}.columnHeaders");
  const { data, isPending } = use${featurePascal}List({
    query: { queryKey: ["${featureCamel}List"] },
  });

  if (!data) return null;

  return (
    <DataTable
      columns={${featurePascal}Columns({
        getHeader: ${featureCamel}ColumnHeaderTranslations as (key: keyof ${featurePascal}ListResponse[number]) => string,
      })}
      data={data.data.list}
      isLoading={isPending}
    />
  );
};
`;
}

/* messages types template (per-feature) */
function featureMessagesTypeTemplate(
  featureCamel: string,
  featurePascal: string,
) {
  return `import ${featureCamel}Messages from "./en.json";
export type ${featurePascal}Messages = typeof ${featureCamel}Messages;

export const ${featurePascal}Messages: ${featurePascal}Messages = {
  ...${featureCamel}Messages,
};
`;
}

/* translations messages en/ar templates */
function messagesJsonContent(featureCamel: string, lang: "en" | "ar") {
  if (lang === "en") {
    const obj: any = {
      [featureCamel]: {
        form: {
          headings: {
            title: "{action} " + capitalize(featureCamel),
            description: `Use this form to {action} an ${capitalize(featureCamel)}.`,
          },
          fields: { name: "Name", description: "Description" },
        },
        headers: { list: "List" },
        columnHeaders: {
          name: "name",
          description: "description",
          updatedAt: "Last Updated",
        },
      },
    };
    return JSON.stringify(obj, null, 2);
  } else {
    const obj: any = {
      [featureCamel]: {
        form: {
          headings: {
            title: "{action} " + capitalize(featureCamel),
            description: `استخدم هذا النموذج لـ {action} ${capitalize(featureCamel)}`,
          },
          fields: { name: "الاسم", description: "الوصف" },
        },
        headers: { list: "قائمة" },
        columnHeaders: {
          name: "الاسم",
          description: "الوصف",
          updatedAt: "آخر تحديث",
        },
      },
    };
    return JSON.stringify(obj, null, 2);
  }
}

/* ----------------------- Central files templates (auto-regenerated) ----------------------- */

/**
 * Generates src/i18n/request.ts content.
 * - commonPath is relative to SRC (./messages/common)
 * - features: array of feature camel names
 */
function genGetRequestConfigContent(features: string[]) {
  // from file at src/i18n/request.ts we will import ./messages/common/${locale}.json and features from ./features/<feature>/translations/messages/${locale}.json
  const importsArray = [
    `    (await import(\`../../messages/common/\${locale}.json\`)).default,`,
    // feature imports: each one is a literal feature path with dynamic ${locale}
    ...features.map(
      (f) =>
        `    (await import(\`../features/${f}/${DIRS.translations}/${DIRS.messages}/\${locale}.json\`)).default,`,
    ),
  ];

  return `import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";

  const [common, ${features.map((f, i) => `feat${i}`).join(", ")}] = await Promise.all([
${importsArray.join("\n")}
  ]);

  // build messages object
  const messages = Object.assign({}, common, ${features.map((_, i) => `feat${i}`).join(", ")});

  return {
    locale,
    messages,
  };
});
`;
}

/**
 * Generates src/messages/types.ts aggregator for en.json
 * Note: imports are static for en.json so bundlers can analyze them.
 */
function genMessagesIndexContent(features: string[]) {
  const imports = [`import commonMessages from "./common/en.json";`].concat(
    features.map(
      (f) =>
        `import ${f}Messages from "../src/features/${f}/${DIRS.translations}/${DIRS.messages}/en.json";`,
    ),
  );

  const typesUnion = ["typeof commonMessages"]
    .concat(features.map((f) => `typeof ${f}Messages`))
    .join(" &\n  ");

  const spreadParts = ["...commonMessages"]
    .concat(features.map((f) => `...${f}Messages`))
    .join(",\n  ");

  return `${imports.join("\n")}

export type Messages = ${typesUnion};

export const messages: Messages = {
  ${spreadParts}
};
`;
}

/* ---------------------------- Files/dirs orchestration ---------------------------- */

async function discoverFeatures(): Promise<string[]> {
  try {
    const entries = await fs.readdir(FEATURES_DIR, { withFileTypes: true });
    const dirs = entries.filter((e) => e.isDirectory()).map((d) => d.name);
    return dirs;
  } catch {
    return [];
  }
}

/* ------------------------------- Feature generator ------------------------------- */

async function generateFeature(rawName: string, opts: Options) {
  if (!rawName) throw new Error("feature name is required");

  const featureCamel = toCamelCase(rawName);
  const featurePascal = toPascalCase(rawName);

  // feature root: src/features/<featureCamel>
  const featureRoot = path.join(FEATURES_DIR, featureCamel);
  await ensureDir(featureRoot);

  // section directories
  const mutationDir = path.join(featureRoot, DIRS.mutation);
  const translationsDir = path.join(featureRoot, DIRS.translations);
  const messagesDir = path.join(translationsDir, DIRS.messages);
  const hooksDir = path.join(translationsDir, DIRS.hooks);
  const listDir = path.join(featureRoot, DIRS.list);

  await Promise.all([
    ensureDir(mutationDir),
    ensureDir(translationsDir),
    ensureDir(messagesDir),
    ensureDir(hooksDir),
    ensureDir(listDir),
  ]);

  // write mutation files (PascalCase component filenames)
  await writeIfNeeded(
    path.join(mutationDir, `${featurePascal}DetailsForm.tsx`),
    detailsFormTemplate(featureCamel, featurePascal),
    opts,
  );
  await writeIfNeeded(
    path.join(mutationDir, `Create${featurePascal}Form.tsx`),
    createFormTemplate(featurePascal),
    opts,
  );
  await writeIfNeeded(
    path.join(mutationDir, `Update${featurePascal}Form.tsx`),
    updateFormTemplate(featureCamel, featurePascal),
    opts,
  );
  await writeIfNeeded(
    path.join(mutationDir, `${featurePascal}FormButton.tsx`),
    formButtonTemplate(featureCamel, featurePascal),
    opts,
  );
  await writeIfNeeded(
    path.join(mutationDir, `index.ts`),
    `export * from "./Create${featurePascal}Form";\nexport * from "./Update${featurePascal}Form";\nexport * from "./${featurePascal}FormButton";\nexport { default as ${featurePascal}DetailsForm } from "./${featurePascal}DetailsForm";\n`,
    opts,
  );

  // translations hooks
  await writeIfNeeded(
    path.join(hooksDir, `use${featurePascal}Translations.ts`),
    translationsHookTemplate(featureCamel, featurePascal),
    opts,
  );

  // messages en.json & ar.json
  await writeIfNeeded(
    path.join(messagesDir, `en.json`),
    messagesJsonContent(featureCamel, "en"),
    opts,
  );
  await writeIfNeeded(
    path.join(messagesDir, `ar.json`),
    messagesJsonContent(featureCamel, "ar"),
    opts,
  );

  // messages types file (per-request)
  const messagesTypeFilename = `${featurePascal}Messages.ts`;
  await writeIfNeeded(
    path.join(messagesDir, messagesTypeFilename),
    featureMessagesTypeTemplate(featureCamel, featurePascal),
    opts,
  );

  // list files
  await writeIfNeeded(
    path.join(listDir, `Columns.tsx`),
    columnsTemplate(featurePascal),
    opts,
  );
  await writeIfNeeded(
    path.join(listDir, `DataTable.tsx`),
    dataTableTemplate(featureCamel, featurePascal),
    opts,
  );
  await writeIfNeeded(
    path.join(listDir, `index.ts`),
    `export * from "./DataTable";\n`,
    opts,
  );

  // feature root index barrel
  const featureIndexContent = `export * from "./${DIRS.mutation}";
export * from "./${DIRS.translations}";
export * from "./${DIRS.list}";
`;
  await writeIfNeeded(
    path.join(featureRoot, `index.ts`),
    featureIndexContent,
    opts,
  );

  // regenerate central files (scan all features)
  const allFeatures = await discoverFeatures();
  // ensure messages root exists
  await ensureDir(MESSAGES_ROOT);
  // 1) request.ts at src/i18n/request.ts
  const getRequestConfigPath = path.join(WEB_SRC, "i18n/request.ts");
  const getRequestConfigContent = genGetRequestConfigContent(allFeatures);
  // 2) messages types aggregator at src/messages/types.ts
  const messagesIndexPath = path.join(MESSAGES_ROOT, "types.ts");
  const messagesIndexContent = genMessagesIndexContent(allFeatures);

  // write central files — we will overwrite these by default (unless dry-run)
  // but respect --force: central files are updated regardless of per-feature force flag because we want them kept in sync
  await writeIfNeeded(getRequestConfigPath, getRequestConfigContent, {
    force: true,
    dryRun: opts.dryRun,
  });
  await writeIfNeeded(messagesIndexPath, messagesIndexContent, {
    force: true,
    dryRun: opts.dryRun,
  });

  console.log("\nFeature generation finished.");
  console.log(`- feature: src/features/${featureCamel}`);
  console.log(
    `- central files updated: ${path.relative(ROOT, getRequestConfigPath)}, ${path.relative(ROOT, messagesIndexPath)}`,
  );
  if (opts.dryRun)
    console.log("Note: dry-run - no files were actually written.");
}

/* ----------------------------------- CLI ----------------------------------- */

async function main() {
  const argv = process.argv.slice(2);
  if (!argv.length) {
    console.error(
      "Usage: npx tsx create-feature.ts <name> [--force] [--dry-run]",
    );
    process.exit(1);
  }
  const raw = argv[0];
  if (!raw || typeof raw !== "string") {
    throw new Error("Feature name is required and must be a string");
  }
  const force = argv.includes("--force");
  const dryRun = argv.includes("--dry-run");
  try {
    await generateFeature(raw, { force, dryRun });
  } catch (err: any) {
    console.error("error:", err?.message ?? err);
    process.exit(2);
  }
}

if (require.main === module) main();
