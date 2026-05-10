export function routesIndexTemplate({
  featurePascal,
  featureCamel,
  kebabCase,
}: {
  featurePascal: string;
  featureCamel: string;
  kebabCase: string;
}) {
  return `import { OpenAPIHono } from "@hono/zod-openapi";

import { create${featurePascal}Route } from "./create-${kebabCase}.route.js";
import { ${featureCamel}ListRoute } from "./${kebabCase}-list.route.js";
import { update${featurePascal}Route } from "./update-${kebabCase}.route.js";
import { get${featurePascal}ByIdRoute } from "./get-${kebabCase}.route.js";
import { delete${featurePascal}Route } from "./delete-${kebabCase}.route.js";

/**
 * ${featurePascal} Routes Aggregator
 */
export const app = new OpenAPIHono();

/**
 * Register routes
 */
app.route("/", create${featurePascal}Route);
app.route("/", ${featureCamel}ListRoute);
app.route("/", update${featurePascal}Route);
app.route("/", ${featureCamel}OptionListRoute);
app.route("/", get${featurePascal}ByIdRoute);
app.route("/", delete${featurePascal}Route);

/**
 * Export namespaced routes
 */
export { app as ${featurePascal}Routes };
`;
}
