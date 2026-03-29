export const detailsFormTemplate = (camel: string, pascal: string) => `
export default function ${pascal}DetailsForm() {
  return <div>${pascal} form</div>;
}
`;
