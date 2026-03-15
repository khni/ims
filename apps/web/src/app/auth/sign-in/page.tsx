import { SignInForm } from "@/src/features/auth/form/sign-in";

export const dynamic = "force-dynamic"; // ensures fresh data

export default async function Page() {
  return <SignInForm />;
}
