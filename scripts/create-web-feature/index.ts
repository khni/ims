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
import { createFormTemplate } from "./templates/mutation/create-form.template";
import { updateFormTemplate } from "./templates/mutation/update-form.template";
import { translationsHookTemplate } from "./templates/translations/translation-hooks.template";
import { messagesJsonContent } from "./templates/translations/translation-messages.template";
import { featureMessagesTypeTemplate } from "./templates/translations/translation-messages-types.template";
import { columnsTemplate } from "./templates/list/columns.template";
import { dataTableTemplate } from "./templates/list/data-table.template";
import { formButtonTemplate } from "./templates/mutation/form-button.template";
import { dataTableIndexTemplate } from "./templates/list/list-index.template";
import { formIndexTemplate } from "./templates/mutation/mutation-index.template";
import { translationsIndexTemplate } from "./templates/translations/translation-index.template";

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

  const kebabCase = rawName;
  const featureCamel = toCamelCase(rawName);
  const featurePascal = toPascalCase(rawName);

  // feature root: src/features/<kebab-case>
  const featureRoot = path.join(FEATURES_DIR, kebabCase);
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
    path.join(mutationDir, `create-${kebabCase}-form.tsx`),
    createFormTemplate({
      kebabCase,
      featurePascal,
      featureCamel,
      hooksDir,
      translationsDir,
    }),
    opts,
  );
  await writeIfNeeded(
    path.join(mutationDir, `update-${kebabCase}-form.tsx`),
    updateFormTemplate({
      kebabCase,
      featurePascal,
      featureCamel,
      hooksDir,
      translationsDir,
    }),
    opts,
  );
  await writeIfNeeded(
    path.join(mutationDir, `${kebabCase}-form-button.tsx`),
    formButtonTemplate({ featureCamel, featurePascal, kebabCase }),
    opts,
  );
  await writeIfNeeded(
    path.join(mutationDir, `index.ts`),
    formIndexTemplate({ kebabCase }),
    opts,
  );

  // translations hooks
  await writeIfNeeded(
    path.join(hooksDir, `use-${kebabCase}-translations.ts`),
    translationsHookTemplate({ featureCamel, featurePascal, kebabCase }),
    opts,
  );

  // messages en.json & ar.json
  await writeIfNeeded(
    path.join(messagesDir, `en.json`),
    messagesJsonContent({ featureCamel, lang: "en" }),
    opts,
  );
  await writeIfNeeded(
    path.join(messagesDir, `ar.json`),
    messagesJsonContent({ featureCamel, lang: "ar" }),
    opts,
  );

  // messages types file (per-request)
  const messagesTypeFilename = `${featurePascal}Messages.ts`;
  await writeIfNeeded(
    path.join(messagesDir, messagesTypeFilename),
    featureMessagesTypeTemplate({ featureCamel, featurePascal }),
    opts,
  );
  await writeIfNeeded(
    path.join(translationsDir, `index.ts`),
    translationsIndexTemplate({ kebabCase }),
    opts,
  );

  // list files
  await writeIfNeeded(
    path.join(listDir, `${kebabCase}-columns.tsx`),
    columnsTemplate({ featurePascal, featureCamel, kebabCase }),
    opts,
  );
  await writeIfNeeded(
    path.join(listDir, `${kebabCase}-data-table.tsx`),
    dataTableTemplate({ featureCamel, featurePascal, kebabCase }),
    opts,
  );
  await writeIfNeeded(
    path.join(listDir, `index.ts`),
    dataTableIndexTemplate({ kebabCase }),
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

  /* for now until we finish edit generating templates
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
  */
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
