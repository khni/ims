"use client";
import HomeButton from "@/src/components/buttons/home-btn";
import LangaugeSwitcherBtn from "@/src/components/buttons/langauge-switcher-btn";
import ModeSwitcherBtn from "@/src/components/buttons/mode-switcher-btn";
import UserButton from "@/src/components/buttons/user-btn";
import { useLogoutHandler } from "@/src/features/auth/logout/useLogoutHook";
import { User } from "@/src/types";
import { Navbar } from "@workspace/ui/blocks/layout/navbar";
import React from "react";

const NavbarContainer = ({
  children,
  user,
  isLoading,
}: {
  children: React.ReactNode;
  user?: User;
  isLoading: boolean;
}) => {
  return (
    <>
      <Navbar
        start={<HomeButton />}
        end={
          <>
            <ModeSwitcherBtn /> <LangaugeSwitcherBtn />{" "}
            <UserButton
              useLogoutHandler={useLogoutHandler}
              isLoading={isLoading}
              user={user}
            />
          </>
        }
      />
      <div className="flex-1 flex flex-col gap-4 bg-muted items-center justify-center p-6 md:p-4">
        {children}
      </div>
    </>
  );
};

export default NavbarContainer;
