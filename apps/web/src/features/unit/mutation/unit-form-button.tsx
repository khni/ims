// unit-form-button.tsx
"use client";

import React, { useState } from "react";
import { Modal } from "@workspace/ui/blocks/modal";
import ActionButton from "@workspace/ui/blocks/buttons/action-btn";

import { useCommonTranslations } from "@/messages/common";
import { GetUnitByIdResponse } from "@avuny/shared";

import { UpdateUnitForm }from "@/src/features/unit/mutation/update-unit-form";
import { CreateUnitForm } from "@/src/features/unit/mutation/create-unit-form";

export const UnitFormButton: React.FC<{
  unit?: GetUnitByIdResponse;
}> = ({ unit }) => {
  const [open, setOpen] = useState(false);

  const { actionTranslations } = useCommonTranslations();
  const add = actionTranslations("add");
  const edit = actionTranslations("edit");

  return (
    <div>
      <Modal
        trigger={
          <ActionButton
            type={unit ? "edit" : "add"}
            onClick={() => setOpen(true)}
            title={unit ? edit : add}
          />
        }
        open={open}
        onOpenChange={setOpen}
      >
        {unit ? (
          <UpdateUnitForm unit={unit} />
        ) : (
          <CreateUnitForm />
        )}
      </Modal>
    </div>
  );
};
