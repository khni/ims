import React, { useEffect, useState } from "react";
import { DataTable } from "@workspace/ui/blocks/data-table/data-table";

import { GetUnitCollectionByIdResponse } from "@avuny/shared";
import { TargetUnitColumns } from "@/src/features/unit-collection/mutation/target-items-lines/columns";
import { useUnitOptions } from "@/src/api";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";
import ErrorPage from "@/src/components/error";

function TargetItemLines({
  targetUnits,
  setTargetUnits,
}: {
  targetUnits: GetUnitCollectionByIdResponse["targetUnitLines"];
  setTargetUnits: React.Dispatch<
    React.SetStateAction<GetUnitCollectionByIdResponse["targetUnitLines"]>
  >;
}) {
  const { data, isPending, error } = useUnitOptions();
  useEffect(() => {
    if (targetUnits.length === 0) {
      setTargetUnits([{ id: "", factor: "", targetUnitId: "" }]);
    }
  }, []);
  if (isPending) {
    return <LoadingPage />;
  }
  if (error) {
    return <ErrorPage />;
  }

  return (
    <DataTable
      columns={TargetUnitColumns({ units: data?.data })}
      data={{ list: targetUnits, totalCount: 0, set: setTargetUnits }}
    />
  );
}

export default TargetItemLines;
