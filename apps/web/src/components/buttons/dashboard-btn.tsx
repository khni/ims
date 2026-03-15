"use client";

import { ROUTES } from "@/src/features/routes";
import Loading from "@workspace/ui/blocks/loading/loading";
import { Button } from "@workspace/ui/components/button";

import { BriefcaseBusinessIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type DashboardButtonProps = {
  user: unknown | undefined;
  isLoading: boolean;
};
export default function DashboardButton({
  isLoading,
  user,
}: DashboardButtonProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <Button variant="outline" size="icon" className="cursor-pointer">
        <Loading />
      </Button>
    );
  }
  if (!user) {
    return null;
  }

  return (
    <Button
      onClick={() => router.replace(ROUTES.app.index())}
      variant="outline"
      size="icon"
      className="cursor-pointer"
    >
      <BriefcaseBusinessIcon />
    </Button>
  );
}
