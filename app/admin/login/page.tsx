"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { adminLogin, setAdminToken } from "@/lib/api/admin";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { ROUTES } from "@/lib/constants";
import { SITE_DOMAIN } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminLoginPage() {
  const router = useRouter();
  const { refresh, loading: authLoading } = useAdminAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const { token } = await adminLogin(
        String(form.get("email")),
        String(form.get("password"))
      );
      setAdminToken(token);
      const user = await refresh();
      if (user) {
        router.replace(ROUTES.admin);
      } else {
        setError("Signed in but session could not be verified. Try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <p className="text-gray-400">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex justify-center">
          <SiteLogo href={ROUTES.home} imageClassName="h-12 w-auto max-w-[220px] object-contain" />
        </div>
        <p className="mt-4 text-center text-xs font-bold uppercase tracking-widest text-orange-500">
          Superadmin
        </p>
        <h1 className="mt-2 text-center text-2xl font-bold text-gray-900">
          Admin panel
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage {SITE_DOMAIN} — products, categories, brands, and images.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="username"
            defaultValue="admin@buysell.local"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
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
            {loading ? "Signing in..." : "Enter admin panel"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href={ROUTES.home} className="text-orange-600 hover:underline">
            ← Back to storefront
          </Link>
        </p>
      </div>
    </div>
  );
}
