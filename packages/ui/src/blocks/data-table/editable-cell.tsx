import { useEffect, useState } from "react";
import { CellContext } from "@tanstack/react-table";
import { Input } from "@workspace/ui/components/input";

type EditableCellProps<TData, TValue> = CellContext<TData, TValue>;

export function EditableCell<TData, TValue>({
  getValue,
  row,
  column,
  table,
}: EditableCellProps<TData, TValue>) {
  const initialValue = getValue();

  const [value, setValue] = useState<string>(
    initialValue != null ? String(initialValue) : "",
  );

  useEffect(() => {
    setValue(initialValue != null ? String(initialValue) : "");
  }, [initialValue]);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      className="h-8 w-full"
    />
  );
}

export default EditableCell;
