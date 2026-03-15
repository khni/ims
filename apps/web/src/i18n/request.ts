import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";

  const [common, auth, organization, role] = await Promise.all([
    (await import(`../../messages/common/${locale}.json`)).default,
    (await import(`../features/auth/translations/messages/${locale}.json`))
      .default,
    (
      await import(
        `../features/organization/translations/messages/${locale}.json`
      )
    ).default,
    (await import(`../features/role/translations/messages/${locale}.json`))
      .default,
  ]);

  return {
    locale,
    messages: {
      ...common,
      ...auth,
      ...organization,
      ...role,
    },
  };
});
