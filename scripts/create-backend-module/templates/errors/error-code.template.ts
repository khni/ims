export function errorCodeTemplate({
  featurePascal,
  kebabCase,
}: {
  featurePascal: string;
  kebabCase: string;
}) {
  return `import { getEnum } from "@avuny/utils";
import en from "../../intl/locales/${kebabCase}/en.json" with { type: "json" };

/**
 * ${featurePascal} Error Codes
 *
 * Source of truth: translation file (en.json)
 * - Ensures consistency between backend & i18n
 */
export const ${featurePascal}ErrorCode = getEnum(en.errors);

/**
 * All possible error keys (type-safe)
 */
export type ${featurePascal}ErrorCodeKeys =
  keyof typeof ${featurePascal}ErrorCode;
`;
}
