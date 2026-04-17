export function depsTemplate({
  featurePascal,
  featureCamel,
  kebabCase,
}: {
  featurePascal: string;
  featureCamel: string;
  kebabCase: string;
}) {
  return `import { asClass } from "awilix";

import { ${featurePascal}Repository } from "./repositories/${kebabCase}.repository.js";
import { ${featurePascal}Service } from "./services/${kebabCase}.service.js";

/**
 * ${featurePascal} Dependencies
 *
 * Registers:
 * - Repository (data layer)
 * - Service (business logic layer)
 *
 * Lifetime:
 * - scoped → new instance per request (recommended for web apps)
 */
export const ${featureCamel}Deps = {
  ${featureCamel}Repository: asClass(${featurePascal}Repository).scoped(),
  ${featureCamel}Service: asClass(${featurePascal}Service).scoped(),
};
`;
}
