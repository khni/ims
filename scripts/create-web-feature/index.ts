#!/usr/bin/env tsx
import path from "path";
import { GeneratorCli } from "../generator-cli";
import { createFeatureStructure } from "./structure";
import { DIRS } from "./config";
import { ensureDir } from "../utils/fs";
import { requestConfigTemplate } from "./templates/request-config.template";
import { messageIndexTemplate } from "./templates/message-index.template";

const ROOT = path.resolve(__dirname, "../../");
const WEB_ROOT = path.join(ROOT, "apps/web");
const WEB_SRC = path.join(WEB_ROOT, "src");
const FEATURES_DIR = path.join(WEB_SRC, "features");
const MESSAGES_ROOT = path.join(WEB_ROOT, "messages");

/* ----------------------- Central files templates (auto-regenerated) ----------------------- */

(async () => {
  // regenerate central files (scan all features)

  // ensure messages root exists
  await ensureDir(MESSAGES_ROOT);
  // 1) request.ts at src/i18n/request.ts

  const generatorCli = new GeneratorCli(
    createFeatureStructure,
    ROOT,
    FEATURES_DIR,
  );

  await generatorCli.run();
  const allFeatures = await generatorCli.discoverFolders(FEATURES_DIR);
  console.log("Discovered features:", allFeatures);
  const getRequestConfigPath = path.join(WEB_SRC, "i18n/request.ts");
  const getRequestConfigContent = requestConfigTemplate({
    features: allFeatures,
    dirs: DIRS,
  });

  const messagesIndexPath = path.join(MESSAGES_ROOT, "types.ts");
  const messagesIndexContent = messageIndexTemplate({
    features: allFeatures,
    dirs: DIRS,
  });
  await generatorCli.overrideFiles([
    { fp: getRequestConfigPath, content: getRequestConfigContent },
    { fp: messagesIndexPath, content: messagesIndexContent },
  ]);

  console.log("✨ Central files updated");
})();
