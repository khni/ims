"use client";

import * as React from "react";

import { MoonIcon, SunIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
type ThemeType = "light" | "dark" | "system" | "string";
type Props = {
  setTheme: React.Dispatch<React.SetStateAction<string>>;
};
export function ModeToggle({ setTheme }: Props) {
  const themeList: ThemeType[] = ["light", "dark", "system"];

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const currentTheme =
    typeof window !== "undefined" ? localStorage.getItem("theme") : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="cursor-pointer">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem]  w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {themeList.map((theme) => (
          <DropdownMenuItem
            key={theme}
            onClick={() => setTheme(theme)}
            className={currentTheme === theme ? "bg-accent" : ""}
          >
            {capitalize(theme)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
