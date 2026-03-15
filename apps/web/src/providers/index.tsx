"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { CookiesProvider } from "react-cookie";
import { useState } from "react";
import { Direction } from "radix-ui";
import { Toaster } from "@workspace/ui/components/sonner";
import UserPreferencesContextProvider from "@workspace/ui/providers/UserPreferencesContext";
import { setZodLocale } from "@avuny/zod";
import SelectedOrganizationContextProvider from "@/src/providers/selected-org-provider";

export function Providers({
  children,
  dir,
  locale,
}: {
  children: React.ReactNode;
  dir: "rtl" | "ltr";
  locale?: string;
}) {
  const [client] = useState(new QueryClient());
  if (locale && (locale === "en" || locale === "ar")) {
    setZodLocale(locale);
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <CookiesProvider>
        <UserPreferencesContextProvider>
          <SelectedOrganizationContextProvider>
            <QueryClientProvider client={client}>
              <Direction.Provider dir={dir}>{children}</Direction.Provider>
              <Toaster />
            </QueryClientProvider>
          </SelectedOrganizationContextProvider>
        </UserPreferencesContextProvider>
      </CookiesProvider>
    </NextThemesProvider>
  );
}
