"use client";

import { cn } from "@workspace/ui/lib/utils";
import React, { ReactNode } from "react";

export type NavbarProps = {
  start?: ReactNode;
  end?: ReactNode;
  rtl?: boolean;
};

export const Navbar: React.FC<NavbarProps> = ({ start, end }) => {
  return (
    <header
      className={cn(
        "sticky top-0 flex shrink-0 z-[20] h-[70px] p-4 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-md drop-shadow-lg transition-all"
      )}
    >
      {/* Left Side */}
      <aside className={cn("flex items-center gap-2")}>{start}</aside>

      {/* Right Side */}
      <aside className={cn("flex items-center gap-2")}>{end}</aside>
    </header>
  );
};
