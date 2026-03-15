import { SignUpForm } from "@/src/features/auth/form/sign-up";

export const dynamic = "force-dynamic"; // ensures fresh data

export default async function Page() {
  return <SignUpForm />;
}
