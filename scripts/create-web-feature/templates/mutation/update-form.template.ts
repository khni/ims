export function updateFormTemplate({
  featurePascal,
  featureCamel,

  kebabCase,
}: {
  kebabCase: string;
  featurePascal: string;
  featureCamel: string;
}) {
  return `// update-${kebabCase}-form.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";

import { Form as CustomForm } from "@/src/components/form";
import {
  useUpdate${featurePascal},
  get${featurePascal}ListQueryKey,
} from "@/src/api";

import { update${featurePascal}BodySchema as schema } from "@avuny/shared";
import { use${featurePascal}Translations } from "@/src/features/${kebabCase}/translations/hooks/use-${kebabCase}-translations";

import { Get${featurePascal}ByIdResponse } from  "@avuny/shared";

export type Update${featurePascal}FormProps = {
  ${featureCamel}: Get${featurePascal}ByIdResponse | null;
};

export const Update${featurePascal}Form: React.FC<
  Update${featurePascal}FormProps
> = ({ ${featureCamel} }) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (${featureCamel}) {
      form.reset({
        name: ${featureCamel}.name ?? "",
        description: ${featureCamel}.description ?? "",
      });
    }
  }, [${featureCamel}, form]);

  const { mutateAsync, isPending, error } = useUpdate${featurePascal}();
  const { ${featureCamel}FormFieldsTranslations } =
    use${featurePascal}Translations();

  return (
    <CustomForm
      form={form}
      error={error}
      api={{
        onSubmit: async (data) => {
          if (!${featureCamel}) return;
          await mutateAsync({
            id: ${featureCamel}.id,
            data,
          });
        },
        isLoading: isPending,
      }}
      queryInvalidateKey={get${featurePascal}ListQueryKey()}
      getLabel={${featureCamel}FormFieldsTranslations}
      resourceName="${featureCamel}"
      actionName="update"
      fields={[
        {
          key: "name",
          content: { name: "name", type: "text" },
          spans: { base: 4, md: 2 },
        },
        {
          key: "description",
          content: { name: "description", type: "text" },
          spans: { base: 4, md: 2 },
        },
      ]}
    />
  );
};
`;
}
