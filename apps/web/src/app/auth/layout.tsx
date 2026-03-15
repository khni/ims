"use client";
import { useIsAuthenticated } from "@/src/api";
import LangaugeSwitcherBtn from "@/src/components/buttons/langauge-switcher-btn";
import ModeSwitcherBtn from "@/src/components/buttons/mode-switcher-btn";
import { ROUTES } from "@/src/features/routes";
import { Navbar } from "@workspace/ui/blocks/layout/navbar";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";
import { redirect, useRouter } from "next/navigation";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const { data, isLoading } = useIsAuthenticated({
    query: {
      queryKey: ["getAuthenticatedUser"],
      retry: 1,
    },
  });
  if (isLoading) {
    return <LoadingPage />;
  }
  if (data?.success) {
    redirect(ROUTES.app.index());
  }
  return (
    <div className="flex flex-col h-screen">
      <Navbar
        end={
          <>
            <ModeSwitcherBtn /> <LangaugeSwitcherBtn />
          </>
        }
      />
      <div className="flex-1 flex flex-col gap-4 bg-muted items-center justify-center p-6 md:p-4">
        {children}
      </div>
    </div>
  );
}
