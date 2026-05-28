import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { SITE_DOMAIN, SITE_LOGO_PATH, SITE_NAME } from "@/lib/site";

interface SiteLogoProps {
  href?: string | null;
  showText?: boolean;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function SiteLogo({
  href = ROUTES.home,
  showText = false,
  className = "",
  imageClassName = "h-9 w-auto object-contain",
  priority = false,
}: SiteLogoProps) {
  const inner = (
    <>
      <Image
        src={SITE_LOGO_PATH}
        alt={SITE_NAME}
        width={380}
        height={108}
        className={imageClassName}
        priority={priority}
      />
      {showText && (
        <span className="flex flex-col leading-tight">
          <span className="text-xl font-bold tracking-tight text-gray-900">
            {SITE_NAME}
          </span>
          <span className="text-xs font-medium text-gray-500">{SITE_DOMAIN}</span>
        </span>
      )}
    </>
  );

  const layoutClass = `flex shrink-0 items-center gap-2 ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={layoutClass}>
        {inner}
      </Link>
    );
  }

  return <div className={layoutClass}>{inner}</div>;
}
