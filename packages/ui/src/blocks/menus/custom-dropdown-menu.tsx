"use client";

import { useState } from "react";
import { MoreVerticalIcon, Trash2Icon, PencilIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";

type Props = {
  onDelete?: () => Promise<void>;
  onEdit?: () => Promise<void>;

  // Optional text props
  deleteLabel?: string;
  editLabel?: string;
  confirmTitle?: string;
  confirmDescription?: string;
  confirmActionText?: string;
  cancelText?: string;
};

export function CustomDropdownMenu({
  onDelete,
  onEdit,
  deleteLabel = "Delete",
  editLabel = "Edit",
  confirmTitle = "Are you absolutely sure?",
  confirmDescription = "This action cannot be undone. This will permanently delete this item.",
  confirmActionText = "Delete",
  cancelText = "Cancel",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="hover:bg-muted transition"
          >
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-md">
          {onEdit && (
            <DropdownMenuItem
              onClick={onEdit}
              className="cursor-pointer flex items-center gap-2"
            >
              <PencilIcon className="h-4 w-4" />
              <span>{editLabel}</span>
            </DropdownMenuItem>
          )}

          {onEdit && onDelete && <DropdownMenuSeparator />}

          {onDelete && (
            <DropdownMenuItem
              onClick={() => {
                setOpen(true);
              }}
              className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-600"
            >
              <Trash2Icon className="h-4 w-4" />
              <span>{deleteLabel}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirm Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">
              {confirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              {confirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">
              {cancelText}
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                setOpen(false);
                onDelete?.();
              }}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              {confirmActionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
