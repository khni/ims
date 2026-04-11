export function createFormTemplate({
  featurePascal,
  featureCamel,
  hooksDir,
  translationsDir,
}: {
  featurePascal: string;
  featureCamel: string;
  hooksDir: string;
  translationsDir: string;
}) {
  return `// create-${featureCamel}.form.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";

import { Form as CustomForm } from "@/src/components/form";
import {
  useCreate${featurePascal},
  get${featurePascal}ListQueryKey,
} from "@/src/api";

import { create${featurePascal}Schema as schema } from "@avuny/shared";
import { use${featurePascal}Translations } from "@/src/features/${featureCamel}/${translationsDir}/${hooksDir}/use${featurePascal}Translations";

export const Create${featurePascal}Form: React.FC = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutateAsync, isPending, error } = useCreate${featurePascal}();
  const { ${featureCamel}FormFieldsTranslations } =
    use${featurePascal}Translations();

  return (
    <CustomForm
      form={form}
      error={error}
      api={{
        onSubmit: async (data) => {
          await mutateAsync({ data });
        },
        isLoading: isPending,
      }}
      queryInvalidateKey={get${featurePascal}ListQueryKey()}
      getLabel={${featureCamel}FormFieldsTranslations}
      resourceName="${featureCamel}"
      actionName="create"
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
