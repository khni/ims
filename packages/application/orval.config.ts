import { defineConfig } from "orval";

const webTarget = "../../apps/web/src/api";

export default defineConfig({
  web: {
    input: "./openapi/openapi.json",
    output: {
      target: `${webTarget}/index.ts`,
      schemas: `${webTarget}/model`,
      client: "react-query",
      mode: "single",
      override: {
        mutator: {
          path: `${webTarget}/../mutator/custom-instance.ts`,
          name: "customInstance",
        },
      },
    },
  },
  // mobile: {
  //   input: "swagger.json",
  //   output: {
  //     target: `${mobileTarget}/index.ts`,
  //     schemas: `${mobileTarget}/model`,
  //     client: "axios",
  //     mode: "single",
  //     override: {
  //       mutator: {
  //         path: `${mobileTarget}/mutator/custom-instance.ts`,
  //         name: "customInstance",
  //       },
  //     },
  //   },
  // },
});
