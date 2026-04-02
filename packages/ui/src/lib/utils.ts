import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function replaceUrlParamsPlaceholders<T extends Record<string, string>>(
  url: string,
  params: T,
): string {
  let replacedUrl = url;

  Object.keys(params).forEach((key) => {
    replacedUrl = replacedUrl.replace(`:${key}`, params[key] as any);
  });

  return replacedUrl;
}

export function mapSortingArray(
  arr: { id: string; desc: boolean }[],
): Record<string, string> {
  return arr.reduce(
    (acc, { id, desc }) => {
      acc[id] = desc ? "desc" : "asc";
      return acc;
    },
    {} as Record<string, string>,
  );
}

export const cleanEmptyParams = <T extends Record<string, unknown>>(
  search: T,
) => {
  const newSearch = { ...search };
  Object.keys(newSearch).forEach((key) => {
    const value = newSearch[key];
    if (
      value === undefined ||
      value === "" ||
      (typeof value === "number" && isNaN(value))
    ) {
      delete newSearch[key];
    }
  });

  // if (search.pageIndex === DEFAULT_PAGE_INDEX) delete newSearch.pageIndex;
  // if (search.pageSize === DEFAULT_PAGE_SIZE) delete newSearch.pageSize;

  return newSearch;
};
