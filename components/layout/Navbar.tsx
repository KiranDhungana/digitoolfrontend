import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  return (
    <nav className="border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <ul className="flex flex-wrap items-center gap-4 sm:gap-5">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-800 transition hover:text-orange-600"
              >
                {link.label}
                {"hasDropdown" in link && link.hasDropdown && (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
