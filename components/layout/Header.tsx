"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { CartLink } from "@/components/layout/CartLink";
import { HeaderChatLink } from "@/components/layout/HeaderChatLink";
import { HeaderUserMenu } from "@/components/layout/HeaderUserMenu";
import { Navbar } from "@/components/layout/Navbar";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { SearchInput } from "@/components/ui/SearchInput";
import { ROUTES } from "@/lib/constants";

const LOGO_CLASS_DEFAULT =
  "h-14 w-auto max-w-[260px] object-contain sm:h-16 sm:max-w-[300px] lg:h-[4.25rem] lg:max-w-[340px]";

const LOGO_CLASS_HOME =
  "h-16 w-auto max-w-[280px] object-contain sm:h-[4.5rem] sm:max-w-[340px] lg:h-[4.75rem] lg:max-w-[380px]";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === ROUTES.home;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
          <SiteLogo
            priority
            imageClassName={isHome ? LOGO_CLASS_HOME : LOGO_CLASS_DEFAULT}
          />

          <div className="flex flex-1 justify-center px-0 lg:px-6">
            <Suspense
              fallback={
                <div
                  className="h-10 w-full max-w-xl rounded-full border border-gray-200 bg-gray-50"
                  aria-hidden
                />
              }
            >
              <SearchInput compact />
            </Suspense>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 sm:gap-4">
            <HeaderChatLink />
            <CartLink />
            <HeaderUserMenu />
          </div>
        </div>
      </div>
      <Navbar />
    </header>
  );
}
