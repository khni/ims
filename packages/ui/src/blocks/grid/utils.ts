export type SpanValue = 1 | 2 | 3 | 4;

export type Breakpoints = "base" | "sm" | "md" | "lg" | "xl";

export type ResponsiveSpans = Partial<Record<Breakpoints, SpanValue>>;

export const responsiveSpanClassMap: Record<
  Breakpoints,
  Record<SpanValue, string>
> = {
  base: {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
  },
  sm: {
    1: "sm:col-span-1",
    2: "sm:col-span-2",
    3: "sm:col-span-3",
    4: "sm:col-span-4",
  },
  md: {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
  },
  lg: {
    1: "lg:col-span-1",
    2: "lg:col-span-2",
    3: "lg:col-span-3",
    4: "lg:col-span-4",
  },
  xl: {
    1: "xl:col-span-1",
    2: "xl:col-span-2",
    3: "xl:col-span-3",
    4: "xl:col-span-4",
  },
};

export const buildFullSpanClasses = (responsiveSpans: ResponsiveSpans) => {
  const classes: string[] = [];

  (Object.keys(responsiveSpans) as Breakpoints[]).forEach((size) => {
    const span = responsiveSpans[size];
    if (span && responsiveSpanClassMap[size]) {
      classes.push(responsiveSpanClassMap[size][span]);
    }
  });

  return classes.join(" ");
};
