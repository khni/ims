#!/usr/bin/env tsx
import path from "path";
import { GeneratorCli } from "../generator-cli";

import {
  createModuleLocaleStructure,
  createModuleSharedStructure,
  createModuleStructure,
} from "./structure";
import { schemasIndexTemplate } from "./templates/shared/schemas-index.template";
import { typesIndexTemplate } from "./templates/shared/types-index.template";
import { execSync } from "node:child_process";
import { ensureDir } from "../utils/fs";

import { transTemplate } from "./templates/intl/trans.template";
import { i18nInitTemplate } from "./templates/intl/i18next.template";
import { i18nTypesTemplate } from "./templates/intl/i18next-d.template";

const ROOT = path.resolve(__dirname, "../../");
const PACKAGES_ROOT = path.join(ROOT, "packages");
const SHARED_PACKAGE_DIR = path.join(PACKAGES_ROOT, "shared");
const SHARED_PACKAGE_SRC_DIR = path.join(SHARED_PACKAGE_DIR, "src");
const APPLICATOPN_PACKAGE_DIR = path.join(PACKAGES_ROOT, "application");
const APPLICATION_PACKAGE_SRC_DIR = path.join(APPLICATOPN_PACKAGE_DIR, "src");
const APPLICATION_PACKAGE_MODULES_DIR = path.join(
  APPLICATION_PACKAGE_SRC_DIR,
  "modules",
);

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
    APPLICATION_PACKAGE_MODULES_DIR,
  );

  await applicationGeneratorCli.run();

  //intl
  const INTL_DIR = path.join(APPLICATION_PACKAGE_SRC_DIR, "intl");

  await ensureDir(INTL_DIR);

  const INTL_Locales_DIR = path.join(INTL_DIR, "locales");

  await ensureDir(INTL_Locales_DIR);

  const intlGeneratorCli = new GeneratorCli(
    createModuleLocaleStructure,
    ROOT,
    INTL_Locales_DIR,
  );

  await intlGeneratorCli.run();

  const intlModules = await intlGeneratorCli.discoverFolders(INTL_Locales_DIR);

  await intlGeneratorCli.overrideFiles([
    {
      fp: path.join(INTL_DIR, "i18next.ts"),
      content: i18nInitTemplate({ modules: intlModules }),
    },
    {
      fp: path.join(INTL_DIR, "trans.ts"),
      content: transTemplate(),
    },
    {
      fp: path.join(INTL_DIR, "i18next.d.ts"),
      content: i18nTypesTemplate({ modules: intlModules }),
    },
  ]);
})();
