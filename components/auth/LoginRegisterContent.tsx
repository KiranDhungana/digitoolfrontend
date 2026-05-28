"use client";

import { useSearchParams } from "next/navigation";
import { AuthCard, AuthLink } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { UserAuthForm } from "@/components/auth/UserAuthForm";
import { ROUTES } from "@/lib/constants";

type Mode = "login" | "register" | "forgot";

export function LoginRegisterContent({ mode }: { mode: Mode }) {
  const searchParams = useSearchParams();
  const redirect =
    searchParams.get("redirect") &&
    searchParams.get("redirect")!.startsWith("/")
      ? searchParams.get("redirect")!
      : ROUTES.account;
  const referralCode = searchParams.get("ref")?.trim().toUpperCase() || undefined;

  const registerHref = referralCode
    ? `${ROUTES.register}?redirect=${encodeURIComponent(redirect)}&ref=${encodeURIComponent(referralCode)}`
    : `${ROUTES.register}?redirect=${encodeURIComponent(redirect)}`;
  const loginHref = `${ROUTES.login}?redirect=${encodeURIComponent(redirect)}`;
  const forgotHref = `${ROUTES.forgotPassword}?redirect=${encodeURIComponent(redirect)}`;

  if (mode === "login") {
    return (
      <div className="w-full max-w-md space-y-6">
        <AuthCard
          title="Welcome back"
          subtitle="Sign in with your email and password."
          footer={
            <>
              New here? <AuthLink href={registerHref}>Create an account</AuthLink>
              {" · "}
              <AuthLink href={forgotHref}>Forgot password?</AuthLink>
            </>
          }
        >
          <UserAuthForm mode="login" redirectTo={redirect} />
        </AuthCard>
      </div>
    );
  }

  if (mode === "forgot") {
    return (
      <div className="w-full max-w-md space-y-6">
        <AuthCard
          title="Forgot password"
          subtitle="Enter your email to receive a verification code and set a new password."
          footer={
            <>
              Remembered your password? <AuthLink href={loginHref}>Log in</AuthLink>
            </>
          }
        >
          <ForgotPasswordForm redirectTo={redirect} />
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <AuthCard
        title="Create account"
        subtitle="Sign up with your email. We will send a verification code to confirm your address."
        footer={
          <>
            Already have an account?{" "}
            <AuthLink href={loginHref}>Log in</AuthLink>
          </>
        }
      >
        <UserAuthForm
          mode="register"
          redirectTo={redirect}
          referralCode={referralCode}
        />
      </AuthCard>
      <p className="text-center text-xs text-gray-500">
        By continuing you agree to our terms of service.
      </p>
    </div>
  );
}
