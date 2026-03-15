"use client";
import React from "react";
import { Navbar } from "@workspace/ui/blocks/layout/navbar";
import ModeSwitcherBtn from "@/src/components/buttons/mode-switcher-btn";
import DashboardButton from "@/src/components/buttons/dashboard-btn";
import { useIsAuthenticated } from "@/src/api";
import UserButton from "@/src/components/buttons/user-btn";
import { useLogoutHandler } from "@/src/features/auth/logout/useLogoutHook";

//snp rfc
export default function Page() {
  const { data, isLoading } = useIsAuthenticated({
    query: {
      queryKey: ["getAuthenticatedUser"],
      retry: 1,
    },
  });
  return (
    <div>
      <Navbar
        end={
          <>
            <DashboardButton user={{}} isLoading={false} /> <ModeSwitcherBtn />{" "}
            <UserButton
              useLogoutHandler={useLogoutHandler}
              isLoading={isLoading}
              user={data?.data}
            />
          </>
        }
      />
      {"sss"}
    </div>
  );
}
