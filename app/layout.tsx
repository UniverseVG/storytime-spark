import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import NextProvider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";

const myAppFont = Nunito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StoryTime Spark",
  description: "AI Kid's Story Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={myAppFont.className} suppressHydrationWarning={true}>
          <NextProvider>
            {children}
            <Analytics />
          </NextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
