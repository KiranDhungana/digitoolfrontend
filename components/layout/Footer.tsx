import { Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { FooterSupportLinks } from "@/components/layout/FooterSupportLinks";
import { ROUTES } from "@/lib/constants";
import { CONTACT_EMAIL, SITE_ADDRESS, SITE_DOMAIN, SITE_NAME } from "@/lib/site";
import { SiteLogo } from "@/components/layout/SiteLogo";

const footerLinks = {
  Shop: [
    { label: "All gift cards", href: ROUTES.giftCards },
    { label: "Categories", href: ROUTES.categories },
    { label: "Gaming", href: ROUTES.gaming },
    { label: "Brands", href: ROUTES.brands },
  ],
  Account: [
    { label: "Log in", href: ROUTES.login },
    { label: "Register", href: ROUTES.register },
    { label: "Superadmin", href: ROUTES.adminLogin },
    { label: "My account", href: ROUTES.account },
    { label: "Cart", href: ROUTES.cart },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <SiteLogo imageClassName="h-10 w-auto max-w-[180px] object-contain" />
            <p className="mt-4 text-sm text-gray-600">
              Your trusted store for gaming, software, gift cards, and digital
              products at {SITE_DOMAIN}.
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden />
                <span>{SITE_ADDRESS}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition hover:text-orange-600 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">
                {title}
              </h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 transition hover:text-orange-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">
              Support
            </h3>
            <FooterSupportLinks />
          </div>
        </div>
        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {SITE_NAME} ({SITE_DOMAIN}). All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
