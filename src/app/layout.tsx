import type { Metadata } from "next";

import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/constants/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url), 
  title: {
    default: "Renimo",
    template: "%s | Renimo",
  },
  description: "Social media space for everyone to share their thoughts and ideas",
  keywords: [
    "Renimo",
    "Social Media",
    "Social Media Space",
    "Social Media Platform",
    "Social Media App",
    "Social Media Website",
    "Social Media",
    "Social Network",
    "Social Networking",
    "Social Networking App",
    "Social Networking Website",
    "Social Networking Platform",
    "Social Networking Space",
    "Social Networking Site",
    "Social Networking Service",
    "Social Networking Service App",
    "Social Networking Service Website",
  ],
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    siteName: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.png`],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    title: siteConfig.title,
    card: "summary_large_image",
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.png`],
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
    shortcut: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
