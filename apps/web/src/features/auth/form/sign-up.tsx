"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form as CustomForm } from "@/src/components/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { useAuthTranslations } from "@/src/features/auth/translations/hooks/useAuthTrans";
import { useSignUp } from "@/src/api";
import { LocalRegisterInputSchema as schema } from "@avuny/application";
import { useAuthSuccessHandler } from "@/src/features/auth/form/hooks/useAuthSuccessHandler";
import Link from "next/link";

export const SignUpForm = () => {
  const { authLabels, authHeaderTranslations, authMsgsTranslations } =
    useAuthTranslations();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const onSuccess = useAuthSuccessHandler();
  const { mutateAsync, isPending, error } = useSignUp({
    mutation: {
      onSuccess: (data) => onSuccess(data),
    },
  });

  return (
    <>
      <CustomForm
        error={error}
        cardTitle={authHeaderTranslations("signUp")}
        fields={[
          {
            key: "name",
            content: {
              name: "identifier",
              type: "text",
            },

            spans: {
              base: 4,
              md: 2,
            },
          },
          {
            key: "description",
            content: {
              name: "name",
              type: "text",
            },

            spans: {
              base: 4,
              md: 2,
            },
          },
          {
            key: "password",
            content: {
              name: "password",
              type: "password",
            },

            spans: {
              base: 4,
              md: 4,
            },
          },
        ]}
        getLabel={authLabels}
        form={form}
        api={{
          onSubmit: async (data) => mutateAsync({ data }),
          isLoading: isPending,
        }}
      >
        <p className="text-sm text-muted-foreground text-center">
          {authMsgsTranslations("orAlreadyHaveAnAccountSignIn")}
          <Link
            href="/auth/sign-in"
            className="font-medium text-primary hover:underline"
          >
            {" "}
            {authHeaderTranslations("signIn")}
          </Link>
        </p>
      </CustomForm>
    </>
  );
};
