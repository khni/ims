export function messagesJsonContent({
  featureCamel,
  lang,
}: {
  featureCamel: string;
  lang: "en" | "ar";
}) {
  if (lang === "en") {
    const obj: any = {
      [featureCamel]: {
        form: {
          headings: {
            title: "{action} " + featureCamel,
            description: `Use this form to {action} an ${featureCamel}.`,
          },
          fields: { name: "Name", description: "Description" },
        },
        headers: { list: "List" },
        columnHeaders: {
          name: "name",
          description: "description",
          updatedAt: "Last Updated",
        },
      },
    };
    return JSON.stringify(obj, null, 2);
  } else {
    const obj: any = {
      [featureCamel]: {
        form: {
          headings: {
            title: "{action} " + featureCamel,
            description: `استخدم هذا النموذج لـ {action} ${featureCamel}`,
          },
          fields: { name: "الاسم", description: "الوصف" },
        },
        headers: { list: "قائمة" },
        columnHeaders: {
          name: "الاسم",
          description: "الوصف",
          updatedAt: "آخر تحديث",
        },
      },
    };
    return JSON.stringify(obj, null, 2);
  }
}
