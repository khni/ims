import React, { useEffect, useState } from "react";
import { DataTable } from "@workspace/ui/blocks/data-table/data-table";
import { DataColumnExample } from "@workspace/ui/blocks/customizable-table/example-columns";
import DATA from "@workspace/ui/blocks/customizable-table/example-data";
import { GetUnitCollectionByIdResponse } from "@avuny/shared";
import { TargetUnitColumns } from "@/src/features/unit-collection/mutation/target-items-lines/columns";
import { useUnitOptions } from "@/src/api";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";
import ErrorPage from "@/src/components/error";

function TargetItemLines({
  targetUnits,
}: {
  targetUnits: GetUnitCollectionByIdResponse["targetUnitLines"];
}) {
  const [list, setList] = useState(targetUnits);
  const { data, isPending, error } = useUnitOptions();
  useEffect(() => {
    if (list.length === 0) {
      setList([{ id: "", factor: "", targetUnitId: "" }]);
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
      data={{ list, totalCount: 0, set: setList }}
    />
  );
}

export default TargetItemLines;
