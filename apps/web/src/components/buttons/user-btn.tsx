"use client";

import { ROUTES } from "@/src/features/routes";
import { User } from "@/src/types";
import { UserNav } from "@workspace/ui/blocks/layout/nav-user";
import Loading from "@workspace/ui/blocks/loading/loading";

import { Button } from "@workspace/ui/components/button";

import { LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export type UserButtonProps = {
  user: User | undefined;
  isLoading: boolean;
  useLogoutHandler(): {
    submit: () => Promise<void>;
    isPending: boolean;
  };
};

export default function UserButton({
  user,
  isLoading,
  useLogoutHandler,
}: UserButtonProps) {
  const router = useRouter();
  if (isLoading) {
    <Button variant="outline" size="icon" className="cursor-pointer">
      <Loading />
    </Button>;
  }
  if (!user) {
    return (
      <Button
        onClick={() => router.push(ROUTES.auth.index)}
        variant="outline"
        size="icon"
        className="cursor-pointer"
      >
        <LogInIcon />
      </Button>
    );
  }
  const { submit } = useLogoutHandler();
  return (
    <UserNav
      iconOnly
      sections={{
        account: { enabled: true },
        notifications: { enabled: true },
        logout: { enabled: true, onClick: submit },
      }}
      user={user}
    />
  );
}
