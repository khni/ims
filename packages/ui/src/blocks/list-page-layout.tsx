"use client";

import { CustomBreadCrumb } from "@workspace/ui/blocks/custom-bread-crumb";
import { ReactNode } from "react";

type BreadCrumbItem = {
  href: string;
  name: string;
};

type ListPageLayoutProps = {
  /** Display name of the current resource (e.g. "Roles", "Users") */
  resourceName: string;

  /** Breadcrumb navigation items */
  breadCrumbItems: BreadCrumbItem[];

  /** Button or element for creating new resource entries */
  createResourceButton: ReactNode;

  /** Main data table or list component */
  dataTable: ReactNode;

  /** Optional header actions (filters, search, etc.) */
  headerActions?: ReactNode;
};

/**
 * A generic layout wrapper for displaying resource list pages.
 * Includes breadcrumbs, action buttons, and a content section (table, list, etc.).
 */
const ListPageLayout = ({
  resourceName,
  breadCrumbItems,
  createResourceButton,
  dataTable,
  headerActions,
}: ListPageLayoutProps) => {
  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="w-full sm:w-auto">
          <CustomBreadCrumb pageName={resourceName} items={breadCrumbItems} />
        </div>

        <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
          {headerActions}
          {createResourceButton}
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full">{dataTable}</div>
    </section>
  );
};

export default ListPageLayout;
