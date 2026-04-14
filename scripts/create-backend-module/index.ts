#!/usr/bin/env tsx
import path from "path";
import { GeneratorCli } from "../generator-cli";

import {
  createModuleSharedStructure,
  createModuleStructure,
} from "./structure";
import { schemasIndexTemplate } from "./templates/shared/schemas-index.template";
import { typesIndexTemplate } from "./templates/shared/types-index.template";
import { execSync } from "node:child_process";
const ROOT = path.resolve(__dirname, "../../");
const PACKAGES_ROOT = path.join(ROOT, "packages");
const SHARED_PACKAGE_DIR = path.join(PACKAGES_ROOT, "shared");
const SHARED_PACKAGE_SRC_DIR = path.join(SHARED_PACKAGE_DIR, "src");
const APPLICATOPN_PACKAGE_DIR = path.join(PACKAGES_ROOT, "application");
const APPLICATION_PACKAGE_SRC_DIR = path.join(APPLICATOPN_PACKAGE_DIR, "src");

(async () => {
  const generatorCli = new GeneratorCli(
    createModuleSharedStructure,
    ROOT,
    SHARED_PACKAGE_SRC_DIR,
  );

  const schemasPath = path.join(SHARED_PACKAGE_SRC_DIR, "schemas.ts");
  const typesPath = path.join(SHARED_PACKAGE_SRC_DIR, "types.ts");

  await generatorCli.run();
  const modules = await generatorCli.discoverFolders(SHARED_PACKAGE_SRC_DIR);
  await generatorCli.overrideFiles([
    {
      fp: schemasPath,
      content: schemasIndexTemplate({ modules }),
    },
    {
      fp: typesPath,
      content: typesIndexTemplate({ modules }),
    },
  ]);
  execSync("pnpm build", {
    stdio: "inherit",
    cwd: SHARED_PACKAGE_DIR,
  });

  const applicationGeneratorCli = new GeneratorCli(
    createModuleStructure,
    ROOT,
    APPLICATION_PACKAGE_SRC_DIR,
  );

  await applicationGeneratorCli.run();
})();
