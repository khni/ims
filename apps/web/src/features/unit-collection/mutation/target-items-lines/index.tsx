import React, { useEffect, useState } from "react";
import { DataTable } from "@workspace/ui/blocks/data-table/data-table";
import { DataColumnExample } from "@workspace/ui/blocks/customizable-table/example-columns";
import DATA from "@workspace/ui/blocks/customizable-table/example-data";
import { GetUnitCollectionByIdResponse } from "@avuny/shared";
import { TargetUnitColumns } from "@/src/features/unit-collection/mutation/target-items-lines/columns";

function TargetItemLines({
  targetUnits,
}: {
  targetUnits: GetUnitCollectionByIdResponse["targetUnitLines"];
}) {
  const [list, setList] = useState(targetUnits);

  console.log(list);
  return (
    <DataTable
      columns={TargetUnitColumns()}
      data={{ list, totalCount: 0, set: setList }}
    />
  );
}

export default TargetItemLines;
