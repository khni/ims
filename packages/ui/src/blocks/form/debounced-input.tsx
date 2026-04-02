import { InputHTMLAttributes, useEffect, useState } from "react";

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 400,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState<string | number>(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      {...props}
      className=" my-3 flex h-7  bg-secondary rounded-md border border-input px-3 py-2 text-sm transition duration-300 ease-in-out transform ring-2 ring-offset-background focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
      value={value ?? ""}
      onChange={(e) => {
        if (e.target.value === "") return setValue("");
        if (props.type === "number") {
          setValue(e.target.valueAsNumber);
        } else {
          setValue(e.target.value);
        }
      }}
    />
  );
}
