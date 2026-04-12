export type Options = { force: boolean; dryRun: boolean };
export type Context = {
  kebabCase: string;
  featureCamel: string;
  featurePascal: string;
};

export type StructureNode = {
  name: string;
  type: "dir" | "file";
  children?: StructureNode[];
  generate?: (ctx: Context) => string;
};
