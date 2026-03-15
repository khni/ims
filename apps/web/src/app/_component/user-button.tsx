"use client";

import { Button } from "@workspace/ui/components/button";
import { createTestUser } from "../actions";

export default function UsersButton() {
  return (
    <Button
      onClick={async () => {
        await createTestUser();
        window.location.reload(); // refresh to show new users
      }}
      size="sm"
    >
      Add User
    </Button>
  );
}
