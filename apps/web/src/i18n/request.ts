import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";

  const [common, feat0, feat1, feat2, feat3, feat4, feat5, feat6, feat7] =
    await Promise.all([
      (await import(`../../messages/common/${locale}.json`)).default,
      (await import(`../features/auth/translations/messages/${locale}.json`))
        .default,
      (await import(`../features/item/translations/messages/${locale}.json`))
        .default,
      (
        await import(
          `../features/organization/translations/messages/${locale}.json`
        )
      ).default,
      (
        await import(
          `../features/organizationUser/translations/messages/${locale}.json`
        )
      ).default,
      (await import(`../features/role/translations/messages/${locale}.json`))
        .default,
      (await import(`../features/unit/translations/messages/${locale}.json`))
        .default,
      (
        await import(
          `../features/unit-collection/translations/messages/${locale}.json`
        )
      ).default,
      (
        await import(
          `../features/warehouse/translations/messages/${locale}.json`
        )
      ).default,
    ]);

  // build messages object
  const messages = Object.assign(
    {},
    common,
    feat0,
    feat1,
    feat2,
    feat3,
    feat4,
    feat5,
    feat6,
    feat7,
  );

  return {
    locale,
    messages,
  };
});
