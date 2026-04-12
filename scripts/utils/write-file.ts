import { Options } from "../types";

import fs from "fs/promises";
import path from "path";
async function fileExists(fp: string) {
  try {
    await fs.access(fp);
    return true;
  } catch {
    return false;
  }
}
export async function writeIfNeeded(
  fp: string,
  content: string,
  opts: Options,
  ROOT: string,
) {
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
