import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/navbar";
import { QueryProvider } from "./query-provider";

export const metadata: Metadata = {
  title: "ListMyAnime",
  description: "MyAnimeList but just better",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="dark">
        <ClerkProvider>
          <Navbar />
          <QueryProvider>
            <main className=""
            style={{
              backgroundImage: "linear-gradient(to bottom, #131313 0%, #000000 100%)"
            }}
            >
              {children}
            </main>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
