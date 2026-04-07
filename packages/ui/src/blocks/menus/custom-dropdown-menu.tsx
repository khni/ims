import { MoreVerticalIcon, Trash2Icon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

export function CustomDropdownMenu({
  onDelete,
  onEdit,
}: {
  onDelete?: () => void;
  onEdit?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem variant="default" className="cursor-pointer">
          <Trash2Icon />
          <p className="text-red-800">Delete</p>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
