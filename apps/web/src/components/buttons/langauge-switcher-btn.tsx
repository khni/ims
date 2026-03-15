"use client";

import { useUserPreferencesContext } from "@workspace/ui/providers/UserPreferencesContext";
import LanguageSwitcher from "@workspace/ui/blocks/settings/langauge-switcher";

export default function LangaugeSwitcherBtn() {
  const { locale, updateLocale } = useUserPreferencesContext();

  return <LanguageSwitcher locale={locale} updateLocale={updateLocale} />;
}
