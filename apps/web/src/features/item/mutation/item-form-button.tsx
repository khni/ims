// item-form-button.tsx
"use client";

import React, { useState } from "react";
import { Modal } from "@workspace/ui/blocks/modal";
import ActionButton from "@workspace/ui/blocks/buttons/action-btn";

import { useCommonTranslations } from "@/messages/common";
import { GetItemByIdResponse } from "@avuny/shared";

import { UpdateItemForm } from "@/src/features/item/mutation/update-item-form";
import { CreateItemForm } from "@/src/features/item/mutation/create-item-form";

export const ItemFormButton: React.FC<{
  item?: GetItemByIdResponse;
}> = ({ item }) => {
  const [open, setOpen] = useState(false);

  const { actionTranslations } = useCommonTranslations();
  const add = actionTranslations("add");
  const edit = actionTranslations("edit");

  return (
    <div>
      <Modal
        trigger={
          <ActionButton
            type={item ? "edit" : "add"}
            onClick={() => setOpen(true)}
            title={item ? edit : add}
          />
        }
        open={open}
        onOpenChange={setOpen}
      >
        {item ? <UpdateItemForm item={item} /> : <CreateItemForm />}
      </Modal>
    </div>
  );
};
