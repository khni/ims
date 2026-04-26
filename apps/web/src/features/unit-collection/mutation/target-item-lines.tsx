import React from "react";
import { DataTable } from "@workspace/ui/blocks/customizable-table";
import { DataColumnExample } from "@workspace/ui/blocks/customizable-table/example-columns";
import DATA from "@workspace/ui/blocks/customizable-table/example-data";

function TargetItemLines() {
  return <DataTable columns={DataColumnExample()} data={DATA} />;
}

export default TargetItemLines;
