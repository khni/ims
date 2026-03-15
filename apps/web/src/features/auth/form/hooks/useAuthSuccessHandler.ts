"use client";

import { useCommonTranslations } from "@/messages/common";
import { AuthResponse } from "@/src/api/model";
import { ROUTES } from "@/src/features/routes";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
type AuthSuccessOptions = {
  toastTitle: (user: AuthResponse["user"]) => string;
  toastDescription: (user: AuthResponse["user"]) => string;
  redirectTo?: string;
};

export function useAuthSuccessHandler() {
  const router = useRouter();
  const { msgTranslations, entityTranslations } = useCommonTranslations();

  return (data: { data: AuthResponse }, options?: AuthSuccessOptions) => {
    const { tokens, user } = data.data;

    // Store token
    localStorage.setItem("accessToken", tokens.accessToken);

    // // Redirect (defaults to app home)
    setTimeout(() => {
      //   router.replace(ROUTES.app.index());
      location.reload();
    }, 200);

    // Toast
    toast.success(
      msgTranslations("welcome", {
        thing: user.name,
      })
    );
  };
}
