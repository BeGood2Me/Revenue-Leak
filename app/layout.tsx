import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_NAME } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} — Find where your business is losing money`,
  description:
    "Find the top 3 places your business is losing revenue and what to fix first. Free diagnostic in 5 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
