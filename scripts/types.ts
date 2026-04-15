export type Options = { force: boolean; dryRun: boolean };
export type Context = {
  kebabCase: string;
  featureCamel: string;
  featurePascal: string;
  pluralKebabCase: string;
  pluralFeaturePascal: string;
  pluralFeatureCamel: string;
};

export type StructureNode = {
  name: string;
  type: "dir" | "file";
  children?: StructureNode[];
  generate?: (ctx: Context) => string;
  overwrite?: boolean;
};
