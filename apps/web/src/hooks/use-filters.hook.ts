import { useRouter, useSearchParams } from "next/navigation";

export function useFilters<
  TSearchParams extends Record<string, string | object | undefined>,
>() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse search params and restore objects if they were stringified
  const filters = Object.fromEntries(searchParams.entries()) as Record<
    string,
    string
  >;

  type IsoDateString = string & { _isoDateBrand: never };

  // Modified parsing logic
  const parsedFilters = Object.fromEntries(
    Object.entries(filters).map(([key, value]) => {
      try {
        const parsed = JSON.parse(value, (_, value) => {
          // Detect ISO date strings in Cairo-compatible format
          if (
            typeof value === "string" &&
            /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d{3}Z$/.test(value)
          ) {
            return new Date(value);
          }
          return value;
        });
        return [key, parsed];
      } catch {
        return [key, value];
      }
    }),
  ) as TSearchParams;

  const setFilters = (partialFilters: Partial<TSearchParams>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(partialFilters).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(
          key,
          typeof value === "object" && value instanceof Date
            ? value.toISOString() // Convert Dates to UTC strings
            : JSON.stringify(value),
        );
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    router.push("?", { scroll: false });
  };

  return { filters: parsedFilters, setFilters, resetFilters };
}
