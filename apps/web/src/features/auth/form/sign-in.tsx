"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form as CustomForm } from "@/src/components/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { useAuthTranslations } from "@/src/features/auth/translations/hooks/useAuthTrans";
import { useLogin } from "@/src/api";
import { localLoginInputSchema as schema } from "@avuny/shared";
import { useAuthSuccessHandler } from "@/src/features/auth/form/hooks/useAuthSuccessHandler";
import Link from "next/link";
import { GoogleOAuthURLStrategy } from "@workspace/ui/lib/social-login/url/GoogleOAuthURLStrategy";
import { OAuthContext } from "@workspace/ui/lib/social-login/url/OAuthContext";
import { SocialButtons } from "@workspace/ui/blocks/buttons/social-buttons";
import { FacebookOAuthURLStrategy } from "@workspace/ui/lib/social-login/url/FacebookOAuthURLStrategy";

export const SignInForm = () => {
  const { authLabels, authHeaderTranslations, authMsgsTranslations } =
    useAuthTranslations();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const onSuccess = useAuthSuccessHandler();
  const { mutateAsync, isPending, error } = useLogin({
    mutation: {
      onSuccess: (data) => onSuccess(data),
    },
  });
  //social buttons urls
  const googleStrategy = new GoogleOAuthURLStrategy(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
  );
  const context = new OAuthContext(googleStrategy);

  const googleUrl = context.buildAuthURL();

  const fbStrategy = new FacebookOAuthURLStrategy(
    process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
    process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI!,
  );
  context.setStrategy(fbStrategy);

  const fbUrl = context.buildAuthURL();

  return (
    <>
      <CustomForm
        error={error}
        cardTitle={authHeaderTranslations("signIn")}
        fields={[
          {
            key: "identifier",
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
            key: "password",
            content: {
              name: "password",
              type: "password",
            },

            spans: {
              base: 4,
              md: 2,
            },
          },
        ]}
        getLabel={authLabels}
        form={form}
        api={{
          onSubmit: async (data) => await mutateAsync({ data }),
          isLoading: isPending,
        }}
      >
        <SocialButtons
          providers={{ google: { url: googleUrl }, facebook: { url: fbUrl } }}
        />
        <p className="text-sm text-muted-foreground text-center">
          {authMsgsTranslations("orHaveNotAnAccountSignUp")}
          <Link
            href="/auth/sign-up"
            className="font-medium text-primary hover:underline"
          >
            {" "}
            {authHeaderTranslations("signUp")}
          </Link>
        </p>
      </CustomForm>
    </>
  );
};
