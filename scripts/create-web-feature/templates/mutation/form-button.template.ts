export function formButtonTemplate({
  featurePascal,
  featureCamel,
  kebabCase,
}: {
  featurePascal: string;
  featureCamel: string;
  kebabCase: string;
}) {
  return `// ${kebabCase}-form-button.tsx
"use client";

import React, { useState } from "react";
import { Modal } from "@workspace/ui/blocks/modal";
import ActionButton from "@workspace/ui/blocks/buttons/action-btn";

import { useCommonTranslations } from "@/messages/common";
import { Get${featurePascal}ByIdResponse } from "@avuny/shared";

import { Update${featurePascal}Form }from "@/src/features/${kebabCase}/mutation/update-${kebabCase}-form";
import { Create${featurePascal}Form } from "@/src/features/${kebabCase}/mutation/create-${kebabCase}-form";

export const ${featurePascal}FormButton: React.FC<{
  ${featureCamel}?: Get${featurePascal}ByIdResponse;
}> = ({ ${featureCamel} }) => {
  const [open, setOpen] = useState(false);

  const { actionTranslations } = useCommonTranslations();
  const add = actionTranslations("add");
  const edit = actionTranslations("edit");

  return (
    <div>
      <Modal
        trigger={
          <ActionButton
            type={${featureCamel} ? "edit" : "add"}
            onClick={() => setOpen(true)}
            title={${featureCamel} ? edit : add}
          />
        }
        open={open}
        onOpenChange={setOpen}
      >
        {${featureCamel} ? (
          <Update${featurePascal}Form ${featureCamel}={${featureCamel}} />
        ) : (
          <Create${featurePascal}Form />
        )}
      </Modal>
    </div>
  );
};
`;
}
