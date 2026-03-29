export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const toCamelCase = (input: string) =>
  input
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((w, i) => (i === 0 ? w.toLowerCase() : capitalize(w)))
    .join("");

export const toPascalCase = (input: string) =>
  input
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .map(capitalize)
    .join("");
