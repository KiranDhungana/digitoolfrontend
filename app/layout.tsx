import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ChatSocketProvider } from "@/components/chat/ChatSocketProvider";
import { UserAuthProvider } from "@/components/auth/UserAuthProvider";
import { StoreChrome } from "@/components/layout/StoreChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  organizationJsonLd,
  SITE_KEYWORDS,
  webSiteJsonLd,
} from "@/lib/seo";
import {
  SITE_DESCRIPTION,
  SITE_LOGO_PATH,
  SITE_TITLE_DEFAULT,
  SITE_TITLE_TEMPLATE,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE_DEFAULT,
    template: SITE_TITLE_TEMPLATE,
  },
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_NP",
    url: SITE_URL,
    siteName: "Digitoolera",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: SITE_LOGO_PATH,
    apple: SITE_LOGO_PATH,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-gray-900">
        <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
        <UserAuthProvider>
          <ChatSocketProvider>
            <StoreChrome>{children}</StoreChrome>
          </ChatSocketProvider>
        </UserAuthProvider>
      </body>
    </html>
  );
}
