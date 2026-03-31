"use client";

import { ChevronRight } from "lucide-react";
import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar";

import { cn } from "@workspace/ui/lib/utils";

type SubItem = {
  label: string;
  path: string;
  name: string;
};

type Item = {
  label: string;
  icon?: React.JSX.Element;
  isActive?: boolean;
  options?: SubItem[];
};

export function NavMain({
  items,
  onSubItemClick,
  isSubItemActive,
  isItemActive,
}: {
  items: Item[];
  isItemActive?: (item: Item) => boolean;
  onSubItemClick?: (subItem: SubItem) => void;
  isSubItemActive?: (subItem: SubItem) => boolean;
}) {
  return (
    <SidebarGroup>
      {/* 🔹 GROUP LABEL */}
      <SidebarGroupLabel
        className="
          text-xs 
          font-medium 
          text-muted-foreground 
          uppercase 
          tracking-wider
        "
      >
        Workspace
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const isActive = isItemActive?.(item) || item.isActive;

          return (
            <Collapsible
              key={item.label}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {/* 🔹 MAIN ITEM */}
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.label}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer",
                      "hover:bg-muted",
                      isActive && "bg-muted",
                    )}
                  >
                    {item.icon && (
                      <span className="text-muted-foreground">{item.icon}</span>
                    )}

                    <span>{item.label}</span>

                    {/* 🔹 ARROW ONLY IF HAS CHILDREN */}
                    {item.options && (
                      <ChevronRight
                        className="
                          ms-auto 
                          transition-transform 
                          duration-200 
                          group-data-[state=open]/collapsible:rotate-90
                        "
                      />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {/* 🔹 SUB ITEMS */}
                {item.options && (
                  <CollapsibleContent>
                    <SidebarMenuSub
                      className="
                        ml-3 
                        border-l 
                        pl-3 
                        mt-1
                      "
                    >
                      {item.options.map((subItem) => {
                        const active = isSubItemActive?.(subItem);

                        return (
                          <SidebarMenuSubItem key={subItem.label}>
                            <SidebarMenuSubButton
                              onClick={() => onSubItemClick?.(subItem)}
                              className={cn(
                                "w-full text-left text-sm transition-colors cursor-pointer",
                                "text-muted-foreground hover:text-foreground",
                                "hover:bg-muted",
                                active &&
                                  "bg-muted text-foreground font-medium border-e-2 border-primary",
                              )}
                            >
                              {subItem.label}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
