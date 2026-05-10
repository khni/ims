// warehouse-form-button.tsx
"use client";

import React, { useState } from "react";
import { Modal } from "@workspace/ui/blocks/modal";
import ActionButton from "@workspace/ui/blocks/buttons/action-btn";

import { useCommonTranslations } from "@/messages/common";
import { GetWarehouseByIdResponse } from "@avuny/shared";

import { UpdateWarehouseForm }from "@/src/features/warehouse/mutation/update-warehouse-form";
import { CreateWarehouseForm } from "@/src/features/warehouse/mutation/create-warehouse-form";

export const WarehouseFormButton: React.FC<{
  warehouse?: GetWarehouseByIdResponse;
}> = ({ warehouse }) => {
  const [open, setOpen] = useState(false);

  const { actionTranslations } = useCommonTranslations();
  const add = actionTranslations("add");
  const edit = actionTranslations("edit");

  return (
    <div>
      <Modal
        trigger={
          <ActionButton
            type={warehouse ? "edit" : "add"}
            onClick={() => setOpen(true)}
            title={warehouse ? edit : add}
          />
        }
        open={open}
        onOpenChange={setOpen}
      >
        {warehouse ? (
          <UpdateWarehouseForm warehouse={warehouse} />
        ) : (
          <CreateWarehouseForm />
        )}
      </Modal>
    </div>
  );
};
