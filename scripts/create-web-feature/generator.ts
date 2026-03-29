import path from "path";
import { FEATURES_DIR, DIRS } from "./config";

import { detailsFormTemplate } from "./templates/mutation/detailsForm";
import { ensureDir, writeFileSafe } from "../utils/fs";
import { toCamelCase, toPascalCase } from "../utils/cases";

type Options = { force: boolean; dryRun: boolean };

export async function generateFeature(name: string, opts: Options) {
  const camel = toCamelCase(name);
  const pascal = toPascalCase(name);

  const root = path.join(FEATURES_DIR, camel);

  const dirs = {
    mutation: path.join(root, DIRS.mutation),
    list: path.join(root, DIRS.list),
    translations: path.join(root, DIRS.translations),
  };

  // create dirs
  await Promise.all(Object.values(dirs).map(ensureDir));

  // write files
  await writeFileSafe(
    path.join(dirs.mutation, `${pascal}DetailsForm.tsx`),
    detailsFormTemplate(camel, pascal),
    opts,
  );

  console.log("✨ Feature created:", camel);
}
