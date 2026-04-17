import { Context, Options, StructureNode } from "./types";
import { toCamelCase, toPascalCase } from "./utils/cases";
import { ensureDir } from "./utils/fs";
import { writeIfNeeded } from "./utils/write-file";
import fs from "fs/promises";
import path from "path";
export class GeneratorCli {
  private ctx: Context;
  private rawName: string;
  private rawPlural: string;
  private options: Options;
  private node: StructureNode | StructureNode[];

  constructor(
    private createStructure: (ctx: Context) => StructureNode | StructureNode[],
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
    const rawPlural = argv[1];

    if (!raw || typeof raw !== "string") {
      throw new Error("Module name is required and must be a string");
    }
    if (!rawPlural || typeof rawPlural !== "string") {
      throw new Error("Module plural name is required and must be a string");
    }
    this.rawName = raw;
    this.rawPlural = rawPlural;
    const force = argv.includes("--force");
    const dryRun = argv.includes("--dry-run");
    this.options = { force, dryRun };

    this.ctx = this.getContext(this.rawName, this.rawPlural);
    this.node = this.createStructure(this.ctx);
  }

  getContext(rawName: string, rawPlural: string): Context {
    const kebabCase = rawName;
    const featureCamel = toCamelCase(rawName);
    const featurePascal = toPascalCase(rawName);
    const pluralKebabCase = rawPlural;
    const pluralFeaturePascal = toPascalCase(rawPlural);
    const pluralFeatureCamel = toCamelCase(rawPlural);

    return {
      kebabCase,
      featureCamel,
      featurePascal,
      pluralKebabCase,
      pluralFeaturePascal,
      pluralFeatureCamel,
    };
  }

  generateNode = async (
    node: StructureNode | StructureNode[],
    basePath: string,
    opts: Options,
    ROOT: string,
    context: Context,
  ): Promise<void> => {
    // ✅ Normalize to array
    const nodes = Array.isArray(node) ? node : [node];

    for (const currentNode of nodes) {
      const fullPath = path.join(basePath, currentNode.name);

      if (currentNode.type === "dir") {
        await ensureDir(fullPath);

        if (currentNode.children?.length) {
          await this.generateNode(
            currentNode.children,
            fullPath,
            currentNode.overwrite ? { ...opts, force: true } : opts,
            ROOT,
            context,
          );
        }
      } else {
        let dirs: string[] = [];
        if (currentNode.discoverFolders) {
          const folders = await this.discoverFolders(basePath);
          dirs = folders;
        }
        const content = currentNode.generate?.(context, dirs) || "";
        await writeIfNeeded(fullPath, content, opts, ROOT);
      }
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
