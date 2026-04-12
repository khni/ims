import { Context, Options, StructureNode } from "./types";
import { toCamelCase, toPascalCase } from "./utils/cases";
import { ensureDir } from "./utils/fs";
import { writeIfNeeded } from "./utils/write-file";
import fs from "fs/promises";
import path from "path";
export class GeneratorCli {
  private ctx: Context;
  private rawName: string;
  private options: Options;
  private node: StructureNode;

  constructor(
    private createStructure: (ctx: Context) => StructureNode,
    private ROOT: string,
    private basePath: string,
  ) {
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
    this.rawName = raw;
    const force = argv.includes("--force");
    const dryRun = argv.includes("--dry-run");
    this.options = { force, dryRun };

    this.ctx = this.getContext(this.rawName);
    this.node = this.createStructure(this.ctx);
  }

  getContext(rawName: string): Context {
    const kebabCase = rawName;
    const featureCamel = toCamelCase(rawName);
    const featurePascal = toPascalCase(rawName);
    return { kebabCase, featureCamel, featurePascal };
  }

  generateNode = async (
    node: StructureNode,
    basePath: string,
    opts: Options,
    ROOT: string,
    context: Context,
  ) => {
    const fullPath = path.join(basePath, node.name);

    if (node.type === "dir") {
      await ensureDir(fullPath);
      for (const child of node.children || []) {
        await this.generateNode(child, fullPath, opts, ROOT, context);
      }
    } else {
      const content = node.generate?.(context) || "";
      await writeIfNeeded(fullPath, content, opts, ROOT);
    }
  };

  discoverFolders = async (dir: string): Promise<string[]> => {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      return entries.filter((e) => e.isDirectory()).map((d) => d.name);
    } catch {
      return [];
    }
  };

  async run() {
    await this.generateNode(
      this.node,
      this.basePath,
      this.options,
      this.ROOT,
      this.ctx,
    );
  }

  async overrideFiles(files: { fp: string; content: string }[]) {
    for (const { fp, content } of files) {
      console.log("Writing central file:", { fp });
      await writeIfNeeded(
        fp,
        content,
        { force: true, dryRun: this.options.dryRun },
        this.ROOT,
      );
    }
  }
}
