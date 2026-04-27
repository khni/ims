import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { CellContext } from "@tanstack/react-table";

type SelectOption = {
  id: string | number;
  label: string;
  color?: string;
};

type SelectValue = SelectOption | null;

type SelectCellProps<TData, TValue> = CellContext<TData, TValue>;

function ColorIcon({ color }: { color?: string }) {
  return (
    <span
      className="inline-block h-3 w-3 rounded-sm border"
      style={{ backgroundColor: color || "transparent" }}
    />
  );
}

export function createSelectCell(options: SelectOption[]) {
  return function SelectCell<TData, TValue>({
    getValue,
    row,
    column,
    table,
  }: SelectCellProps<TData, TValue>) {
    const value = getValue() as SelectOption;
    const updateData = table.options.meta?.updateData;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="h-full w-full rounded px-2 py-1 text-left text-sm"
            style={{
              backgroundColor: value?.color || "transparent",
            }}
          >
            {value?.label || "Select"}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem
            onClick={() => updateData?.(row.index, column.id, null)}
          >
            <div className="mr-2">
              <ColorIcon />
            </div>
            None
          </DropdownMenuItem>

          {options.map((option) => (
            <DropdownMenuItem
              key={option.id}
              onClick={() => updateData?.(row.index, column.id, option)}
            >
              <div className="mr-2">
                <ColorIcon color={option.color} />
              </div>
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
}

export default createSelectCell;
