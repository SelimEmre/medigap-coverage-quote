import type { Metadata } from "next";
import { Inter } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css'
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Medigap Coverage",
  description: "Medigap Coverage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
     <GoogleTagManager gtmId="GTM-TMRT9RZ" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
