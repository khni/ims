"use client";
import { useIsAuthenticated } from "@/src/api";
import { ROUTES } from "@/src/features/routes";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";
import { redirect } from "next/navigation";
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
  if (!data?.success) {
    redirect(ROUTES.auth.index);
  }
  return <div className="flex flex-col h-screen bg-muted">{children}</div>;
}
