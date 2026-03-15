import { Edit, Link, Plus } from "lucide-react";

import { FilePenLine } from "lucide-react";
import { MouseEventHandler } from "react";
import clsx from "clsx";
import { Button } from "@workspace/ui/components/button";

const ActionButton = ({
  onClick,
  title,
  size = "default",
  type = "add",
}: {
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
  title: string;
  size?: "icon" | "default";
  type?: "add" | "edit";
}) => {
  return (
    // <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
    //   jkkjkj
    // </div>
    <Button
      variant={size === "icon" ? "outline" : "default"}
      type="button"
      onClick={onClick}
      size={size}
    >
      <div className="flex gap-2 items-center justify-center">
        {type === "add" ? <Plus /> : <FilePenLine />}
        <p
          className={clsx(" text-center", {
            hidden: size === "icon",
          })}
        >
          {title}
        </p>
      </div>
    </Button>
  );
};

export default ActionButton;
