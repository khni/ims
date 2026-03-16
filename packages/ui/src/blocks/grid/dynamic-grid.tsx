import { buildFullSpanClasses } from "@workspace/ui/blocks/grid/utils";

type ResponsiveSpans = {
  base?: 1 | 2 | 3 | 4;
  sm?: 1 | 2 | 3 | 4;
  md?: 1 | 2 | 3 | 4;
  lg?: 1 | 2 | 3 | 4;
  xl?: 1 | 2 | 3 | 4;
};

export type DynamicGridItem<Content> = {
  key: string | number;
  content: Content;
  spans: ResponsiveSpans;
} & Pick<React.HTMLAttributes<HTMLDivElement>, "className">;
export default function DynamicGrid<
  Content,
  I extends DynamicGridItem<Content>,
>({
  items,
  contentMapper,
}: {
  items: I[];
  contentMapper: (content: Content) => React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((item) => (
        <div
          key={item.key}
          className={`${item.className} ${buildFullSpanClasses(item.spans)} rounded text-center`}
        >
          {contentMapper(item.content)}
        </div>
      ))}
    </div>
  );
}
