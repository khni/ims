import path from "path";
import { Context, Options, StructureNode } from "../types";
import { ensureDir } from "./fs";
import { writeIfNeeded } from "./write-file";

export async function generateNode(
  node: StructureNode,
  basePath: string,
  opts: Options,
  ROOT: string,
  context: Context,
) {
  const fullPath = path.join(basePath, node.name);

  if (node.type === "dir") {
    await ensureDir(fullPath);
    for (const child of node.children || []) {
      await generateNode(child, fullPath, opts, ROOT, context);
    }
  } else {
    const content = node.generate?.(context) || "";
    await writeIfNeeded(fullPath, content, opts, ROOT);
  }
}
