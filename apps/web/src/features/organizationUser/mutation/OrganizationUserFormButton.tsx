// OrganizationUserFormButton.tsx
"use client";
import React, { useState } from "react";
import { Modal } from "@workspace/ui/blocks/modal";
import ActionButton from "@workspace/ui/blocks/buttons/action-btn";
import { useCommonTranslations } from "@/messages/common";
import { GetOrganizationUserByIdResponse } from "@avuny/shared";
import { CreateOrganizationUserForm } from "./CreateOrganizationUserForm";
import { UpdateOrganizationUserForm } from "./UpdateOrganizationUserForm";

export const OrganizationUserFormButton: React.FC<{ organizationUser?: GetOrganizationUserByIdResponse }> = ({ organizationUser }) => {
  const [open, setOpen] = useState(false);
  const { actionTranslations } = useCommonTranslations();
  const add = actionTranslations("add");
  const edit = actionTranslations("edit");

  return (
    <div>
      <Modal
        trigger={
          <ActionButton
            type={organizationUser ? "edit" : "add"}
            onClick={() => setOpen(true)}
            title={organizationUser ? edit : add}
          />
        }
        open={open}
        onOpenChange={setOpen}
      >
        {organizationUser ? <UpdateOrganizationUserForm organizationUser={organizationUser} /> : <CreateOrganizationUserForm />}
      </Modal>
    </div>
  );
};
