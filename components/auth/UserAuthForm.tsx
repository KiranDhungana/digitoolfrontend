"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/components/auth/UserAuthProvider";
import {
  loginUser,
  requestSignupOtp,
  setUserToken,
  verifySignupOtp,
} from "@/lib/api/user";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type AuthMode = "login" | "register";

interface UserAuthFormProps {
  mode: AuthMode;
  submitLabel?: string;
  redirectTo?: string;
  referralCode?: string;
}

interface PendingSignup {
  name: string;
  email: string;
  password: string;
  phone?: string;
  referralCode?: string;
}

export function UserAuthForm({
  mode,
  submitLabel,
  redirectTo = ROUTES.account,
  referralCode: initialReferralCode,
}: UserAuthFormProps) {
  const router = useRouter();
  const { refresh } = useUserAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerStep, setRegisterStep] = useState<"form" | "otp">("form");
  const [pendingSignup, setPendingSignup] = useState<PendingSignup | null>(
    null
  );
  const [referralCode, setReferralCode] = useState(
    () => initialReferralCode?.trim().toUpperCase() ?? ""
  );

  useEffect(() => {
    if (initialReferralCode?.trim()) {
      setReferralCode(initialReferralCode.trim().toUpperCase());
    }
  }, [initialReferralCode]);

  const finishAuth = async (token: string) => {
    setUserToken(token);
    await refresh();
    router.replace(redirectTo);
  };

  const handleLogin = async (form: FormData) => {
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const result = await loginUser(email, password);
    await finishAuth(result.token);
  };

  const handleRegisterForm = async (form: FormData) => {
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    const phone = String(form.get("phone") ?? "").trim();

    if (!name) {
      setError("Full name is required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const body = {
      name,
      email,
      password,
      phone: phone || undefined,
      referralCode: referralCode.trim() || undefined,
    };

    await requestSignupOtp(body);
    setPendingSignup(body);
    setRegisterStep("otp");
    setError("");
  };

  const handleVerifyOtp = async (form: FormData) => {
    if (!pendingSignup) {
      setError("Please complete the signup form first");
      setRegisterStep("form");
      return;
    }

    const code = String(form.get("code") ?? "").trim();
    if (!code) {
      setError("Enter the verification code from your email");
      return;
    }

    const result = await verifySignupOtp(pendingSignup.email, code);
    await finishAuth(result.token);
  };

  const handleResendOtp = async () => {
    if (!pendingSignup) return;
    setError("");
    setLoading(true);
    try {
      await requestSignupOtp(pendingSignup);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      if (mode === "login") {
        await handleLogin(form);
      } else if (registerStep === "form") {
        await handleRegisterForm(form);
      } else {
        await handleVerifyOtp(form);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const defaultSubmit =
    mode === "login"
      ? "Log in"
      : registerStep === "form"
        ? "Send verification code"
        : "Verify and create account";

  if (mode === "register" && registerStep === "otp" && pendingSignup) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-gray-800">
          <p>
            We sent a <strong>6-digit code</strong> to{" "}
            <strong>{pendingSignup.email}</strong>. Enter it below to finish
            signup. The code expires in 10 minutes. If you do not see it,
            please check your spam/junk folder.
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
        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <Button
          type="submit"
          variant="secondary"
          className="w-full py-3"
          disabled={loading}
        >
          {loading ? "Please wait..." : submitLabel ?? defaultSubmit}
        </Button>
        <div className="flex flex-col gap-2 text-center text-sm">
          <button
            type="button"
            className="font-medium text-orange-600 hover:text-orange-700 hover:underline disabled:opacity-50"
            disabled={loading}
            onClick={handleResendOtp}
          >
            Resend code
          </button>
          <button
            type="button"
            className="text-gray-600 hover:text-gray-900 hover:underline"
            disabled={loading}
            onClick={() => {
              if (pendingSignup.referralCode) {
                setReferralCode(pendingSignup.referralCode);
              }
              setRegisterStep("form");
              setPendingSignup(null);
              setError("");
            }}
          >
            Change email or details
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" && (
        <Input
          label="Full name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="John Doe"
        />
      )}
      <Input
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        required
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        placeholder={mode === "login" ? "Your password" : "At least 8 characters"}
        minLength={mode === "register" ? 8 : undefined}
      />
      {mode === "register" && (
        <>
          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Repeat your password"
            minLength={8}
          />
          <Input
            label="Phone number (optional)"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+977 98XXXXXXXX"
          />
          <Input
            label="Referral code (optional)"
            name="referralCode"
            type="text"
            value={referralCode}
            onChange={(e) =>
              setReferralCode(e.target.value.toUpperCase().replace(/\s/g, ""))
            }
            autoComplete="off"
            placeholder="Friend's referral code"
            className="font-mono tracking-wider"
          />
        </>
      )}
      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <Button
        type="submit"
        variant="secondary"
        className="w-full py-3"
        disabled={loading}
      >
        {loading ? "Please wait..." : submitLabel ?? defaultSubmit}
      </Button>
    </form>
  );
}
