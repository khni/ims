// unit-item-form-button.tsx
"use client";

import React, { useState } from "react";
import { Modal } from "@workspace/ui/blocks/modal";
import ActionButton from "@workspace/ui/blocks/buttons/action-btn";

import { useCommonTranslations } from "@/messages/common";
import { GetUnitItemByIdResponse } from "@avuny/shared";

import UpdateUnitItemForm from "@/src/features/unit-item/mutation/update-unit-item-form";
import CreateUnitItemForm from "@/src/features/unit-item/mutation/create-unit-item-form";

export const UnitItemFormButton: React.FC<{
  unitItem?: GetUnitItemByIdResponse;
}> = ({ unitItem }) => {
  const [open, setOpen] = useState(false);

  const { actionTranslations } = useCommonTranslations();
  const add = actionTranslations("add");
  const edit = actionTranslations("edit");

  return (
    <div>
      <Modal
        trigger={
          <ActionButton
            type={unitItem ? "edit" : "add"}
            onClick={() => setOpen(true)}
            title={unitItem ? edit : add}
          />
        }
        open={open}
        onOpenChange={setOpen}
      >
        {unitItem ? (
          <UpdateUnitItemForm unitItem={unitItem} />
        ) : (
          <CreateUnitItemForm />
        )}
      </Modal>
    </div>
  );
};
