import React, { useEffect, useState } from "react";
import { DataTable } from "@workspace/ui/blocks/data-table/data-table";

import { GetUnitCollectionByIdResponse, targetUnitLines } from "@avuny/shared";
import { TargetUnitColumns } from "@/src/features/unit-collection/mutation/target-items-lines/columns";
import { useUnitOptions } from "@/src/api";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";
import ErrorPage from "@/src/components/error";
import { Button } from "@workspace/ui/components/button";
import { useTranslations } from "next-intl";

function TargetItemLines({
  targetUnits,
  setTargetUnits,
}: {
  targetUnits: GetUnitCollectionByIdResponse["targetUnitLines"];
  setTargetUnits: React.Dispatch<
    React.SetStateAction<GetUnitCollectionByIdResponse["targetUnitLines"]>
  >;
}) {
  const t = useTranslations("common.deleteRowMsgs");
  const targetUnitLinesT = useTranslations(
    "unitCollection.targetUnitLineColumnHeaders",
  );
  const { data, isPending, error } = useUnitOptions();
  useEffect(() => {
    if (targetUnits.length === 0) {
      setTargetUnits([
        { id: "", factor: "", targetUnit: { id: "", name: "" } },
      ]);
    }
  }, []);

  useEffect(() => {
    const lastLine = targetUnits[targetUnits.length - 1];

    if (!lastLine) return;

    const isLastFilled = !!lastLine.targetUnit.id;

    const hasEmptyRowAlready =
      targetUnits.filter((t) => !t.targetUnit.id).length > 0;

    if (isLastFilled && !hasEmptyRowAlready) {
      setTargetUnits((prev) => [
        ...prev,
        { id: "", factor: "", targetUnit: { id: "", name: "" } },
      ]);
    }
  }, [targetUnits]);

  useEffect(() => {
    setTargetUnits((prev) => {
      const emptyRows = prev.filter((t) => !t.targetUnit.id);

      // keep only one empty row
      if (emptyRows.length <= 1) return prev;

      const filled = prev.filter((t) => t.targetUnit.id);

      return [
        ...filled,
        { id: "", factor: "", targetUnit: { id: "", name: "" } },
      ];
    });
  }, [targetUnits]);

  if (isPending) {
    return <LoadingPage />;
  }
  if (error) {
    return <ErrorPage />;
  }

  return (
    <DataTable
      columns={TargetUnitColumns({
        units: data?.data,
        getHeader: targetUnitLinesT,
      })}
      data={{ list: targetUnits, totalCount: 0, set: setTargetUnits }}
      dropdownActions={{
        onDelete: async (row) => {
          const index = Number(row.id);

          setTargetUnits((prev) => prev.filter((_, i) => i !== index));
        },
        msgTranslations: (key) => t(`${key}`),
      }}
    />
  );
}

export default TargetItemLines;
