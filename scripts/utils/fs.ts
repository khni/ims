import fs from "fs/promises";

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function fileExists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

export async function writeFileSafe(
  path: string,
  content: string,
  { force, dryRun }: { force: boolean; dryRun: boolean },
) {
  const exists = await fileExists(path);

  if (exists && !force) {
    console.log("⏭ skipped:", path);
    return;
  }

  if (dryRun) {
    console.log("🧪 dry:", path);
    return;
  }

  await fs.writeFile(path, content);
  console.log(exists ? "♻️ overwrite:" : "✅ create:", path);
}
