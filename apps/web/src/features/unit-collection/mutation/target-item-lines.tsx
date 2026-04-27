import React, { useEffect, useState } from "react";
import { DataTable } from "@workspace/ui/blocks/data-table/data-table";
import { DataColumnExample } from "@workspace/ui/blocks/customizable-table/example-columns";
import DATA from "@workspace/ui/blocks/customizable-table/example-data";

function TargetItemLines() {
  const [list, setList] = useState(DATA);

  console.log(list);
  return (
    <DataTable
      columns={DataColumnExample()}
      data={{ list, totalCount: 0, set: setList }}
    />
  );
}

export default TargetItemLines;
