"use client";

import { Button } from "@workspace/ui/components/button";
import { HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomeButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.replace("/")}
      variant="outline"
      size="icon"
      className="cursor-pointer"
    >
      <HomeIcon />
    </Button>
  );
}
