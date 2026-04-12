/**
 * Generates src/i18n/request.ts content.
 * - commonPath is relative to SRC (./messages/common)
 * - features: array of feature camel names
 */
export function requestConfigTemplate({
  features,
  dirs,
}: {
  features: string[];
  dirs: {
    translations: string;
    messages: string;
  };
}) {
  // from file at src/i18n/request.ts we will import ./messages/common/${locale}.json and features from ./features/<feature>/translations/messages/${locale}.json
  const importsArray = [
    `    (await import(\`../../messages/common/\${locale}.json\`)).default,`,
    // feature imports: each one is a literal feature path with dynamic ${locale}
    ...features.map(
      (f) =>
        `    (await import(\`../features/${f}/${dirs.translations}/${dirs.messages}/\${locale}.json\`)).default,`,
    ),
  ];

  return `import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";

  const [common, ${features.map((f, i) => `feat${i}`).join(", ")}] = await Promise.all([
${importsArray.join("\n")}
  ]);

  // build messages object
  const messages = Object.assign({}, common, ${features.map((_, i) => `feat${i}`).join(", ")});

  return {
    locale,
    messages,
  };
});
`;
}
