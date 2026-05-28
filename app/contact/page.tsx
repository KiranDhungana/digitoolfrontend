import type { Metadata } from "next";
import { Clock, Mail } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactLiveSupport } from "@/components/contact/ContactLiveSupport";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <PageShell>
      <PageHeader
        title="Contact us"
        description={`Questions about orders, gift cards, or your account? The ${SITE_NAME} team is here to help.`}
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Contact us" },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-6">
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                <Mail className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Email us</h2>
                <p className="mt-1 text-sm text-gray-600">
                  For support, partnerships, or general enquiries:
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-3 inline-block text-lg font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-orange-500 shadow-sm">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">Response time</h3>
                <p className="mt-1 text-sm text-gray-600">
                  We aim to reply within 1–2 business days. Include your order
                  email if your question is about a purchase.
                </p>
              </div>
            </div>
          </div>

          <ContactLiveSupport />

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">Before you write</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Check your{" "}
                  <Link
                    href={ROUTES.account}
                    className="font-medium text-orange-600 hover:underline"
                  >
                    account
                  </Link>{" "}
                  for order status, or browse{" "}
                  <Link
                    href={ROUTES.giftCards}
                    className="font-medium text-orange-600 hover:underline"
                  >
                    gift cards
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </PageShell>
  );
}
