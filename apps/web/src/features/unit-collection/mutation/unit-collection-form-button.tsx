// unit-collection-form-button.tsx
"use client";

import React, { useState } from "react";
import { Modal } from "@workspace/ui/blocks/modal";
import ActionButton from "@workspace/ui/blocks/buttons/action-btn";

import { useCommonTranslations } from "@/messages/common";
import { GetUnitCollectionByIdResponse } from "@avuny/shared";

import { UpdateUnitCollectionForm }from "@/src/features/unit-collection/mutation/update-unit-collection-form";
import { CreateUnitCollectionForm } from "@/src/features/unit-collection/mutation/create-unit-collection-form";

export const UnitCollectionFormButton: React.FC<{
  unitCollection?: GetUnitCollectionByIdResponse;
}> = ({ unitCollection }) => {
  const [open, setOpen] = useState(false);

  const { actionTranslations } = useCommonTranslations();
  const add = actionTranslations("add");
  const edit = actionTranslations("edit");

  return (
    <div>
      <Modal
        trigger={
          <ActionButton
            type={unitCollection ? "edit" : "add"}
            onClick={() => setOpen(true)}
            title={unitCollection ? edit : add}
          />
        }
        open={open}
        onOpenChange={setOpen}
      >
        {unitCollection ? (
          <UpdateUnitCollectionForm unitCollection={unitCollection} />
        ) : (
          <CreateUnitCollectionForm />
        )}
      </Modal>
    </div>
  );
};
