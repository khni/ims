"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@workspace/ui/components/breadcrumb";
import { ReactNode, ComponentType } from "react";

type BreadCrumbItem = {
  href: string;
  name: string;
};

type CustomBreadCrumbProps = {
  /** Current page name */
  pageName: string;
  /** List of breadcrumb items */
  items: BreadCrumbItem[];
  /** Optional link wrapper (e.g. Next.js Link or custom routing component) */
  LinkWrapper?: ComponentType<{ href: string; children: ReactNode }>;
};

/**
 * Custom breadcrumb component with optional Link wrapper.
 * If `LinkWrapper` is provided, it wraps breadcrumb links using that component (e.g., Next.js Link).
 * Otherwise, it falls back to a native <a> tag.
 */
export function CustomBreadCrumb({
  pageName,
  items,
  LinkWrapper,
}: CustomBreadCrumbProps) {
  return (
    <Breadcrumb className="">
      <BreadcrumbList>
        {items.map((item, index) => (
          <>
            <BreadcrumbItem key={item.href}>
              {LinkWrapper ? (
                <LinkWrapper href={item.href}>
                  <BreadcrumbLink asChild>{item.name}</BreadcrumbLink>
                </LinkWrapper>
              ) : (
                <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
              )}
            </BreadcrumbItem>

            <BreadcrumbSeparator />
          </>
        ))}

        <BreadcrumbItem>
          <BreadcrumbPage>{pageName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
