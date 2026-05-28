"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/components/auth/UserAuthProvider";
import {
  requestPasswordResetOtp,
  setUserToken,
  verifyPasswordResetOtp,
} from "@/lib/api/user";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ForgotPasswordFormProps {
  redirectTo?: string;
}

export function ForgotPasswordForm({
  redirectTo = ROUTES.account,
}: ForgotPasswordFormProps) {
  const router = useRouter();
  const { refresh } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");

  const finishAuth = async (token: string) => {
    setUserToken(token);
    await refresh();
    router.replace(redirectTo);
  };

  const onRequest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const value = String(form.get("email") ?? "").trim();
    try {
      await requestPasswordResetOtp(value);
      setEmail(value);
      setStep("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const code = String(form.get("code") ?? "").trim();
    const newPassword = String(form.get("newPassword") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const result = await verifyPasswordResetOtp({
        email,
        code,
        newPassword,
      });
      await finishAuth(result.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (step === "request") {
    return (
      <form onSubmit={onRequest} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
        {error ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}
        <Button
          type="submit"
          variant="secondary"
          className="w-full py-3"
          disabled={loading}
        >
          {loading ? "Please wait..." : "Send reset code"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={onVerify} className="space-y-4">
      <div className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-gray-800">
        <p>
          We sent a <strong>6-digit code</strong> to <strong>{email}</strong>.
          Enter it with your new password to reset your account password. If
          you do not see it, please check your spam/junk folder.
        </p>
      </div>
      <Input
        label="Verification code"
        name="code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        required
        maxLength={6}
        placeholder="000000"
        pattern="[0-9]{6}"
      />
      <Input
        label="New password"
        name="newPassword"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
      />
      <Input
        label="Confirm new password"
        name="confirmPassword"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
      />
      {error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        variant="secondary"
        className="w-full py-3"
        disabled={loading}
      >
        {loading ? "Please wait..." : "Reset password"}
      </Button>
      <div className="text-center text-sm">
        <button
          type="button"
          className="text-gray-600 hover:text-gray-900 hover:underline"
          disabled={loading}
          onClick={() => {
            setStep("request");
            setError("");
          }}
        >
          Change email
        </button>
      </div>
    </form>
  );
}
