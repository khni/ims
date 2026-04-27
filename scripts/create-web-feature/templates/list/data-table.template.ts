import { Context } from "../../../types";

export function dataTableTemplate({
  featurePascal,
  featureCamel,
  kebabCase,
  pluralKebabCase,
}: Context) {
  return `// ${kebabCase}-data-table.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { SortingState } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";

import {
  use${featurePascal}List,
  useDelete${featurePascal},
  get${featurePascal}ListQueryKey,
} from "@/src/api";

import type { ${featurePascal}Filters } from "@avuny/shared";

import { ${featurePascal}Columns } from "./${kebabCase}-columns";
import { useFilters } from "@/src/hooks/use-filters.hook";
import { mapSortingArray } from "@workspace/ui/lib/utils";
import DataList from "@/src/components/data-list";

export const ${featurePascal}DataTable: React.FC = () => {
  const columnHeaderTranslations = useTranslations(
    "${featureCamel}.columnHeaders"
  );

  const [sortingState, setSortingState] = useState<SortingState>([
    { id: "updatedAt", desc: false },
  ]);

  const { mutateAsync } = useDelete${featurePascal}();

  const { filters, resetFilters, setFilters } =
    useFilters<${featurePascal}Filters>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isPending } = use${featurePascal}List({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    filters,
    orderBy: mapSortingArray(sortingState),
  });

  const queryClient = useQueryClient();

  return (
    <DataList
      filter={{
        resetFilters,
        onFilterChange: (filters) => setFilters(filters),
        filters,
      }}
      searchKey="name"
      onRowClickConfig={{
        href: "${pluralKebabCase}",
        idKey: "id",
      }}
      filterConfigs={[
        {
          type: "date",
          title: columnHeaderTranslations("updatedAt"),
          key: "updatedAt",
          value: filters.updatedAt,
          onChange: (value) => {
            setFilters({
              updatedAt: value,
            });
          },
        },
      ]}
      isLoading={isPending}
      columns={${featurePascal}Columns({
        getHeader: columnHeaderTranslations,
      })}
      data={data?.data}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sortingState}
      onSortingChange={setSortingState}
      dropdownActions={{
        onDelete: async (row) => {
          await mutateAsync({ id: row.original.id });

          queryClient.invalidateQueries({
            queryKey: get${featurePascal}ListQueryKey(),
          });
        },
      }}
    />
  );
};
`;
}
