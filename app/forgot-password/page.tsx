import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginRegisterContent } from "@/components/auth/LoginRegisterContent";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <PageShell className="flex items-center justify-center py-12">
      <Suspense fallback={<p className="text-center text-gray-500">Loading...</p>}>
        <LoginRegisterContent mode="forgot" />
      </Suspense>
    </PageShell>
  );
}
