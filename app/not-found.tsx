import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  return (
    <PageShell className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-lg text-gray-600">This page could not be found.</p>
      <Link href={ROUTES.home} className="mt-8">
        <Button variant="secondary">Back to home</Button>
      </Link>
    </PageShell>
  );
}
