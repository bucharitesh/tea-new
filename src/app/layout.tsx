import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "../components/ui/sonner";
import Providers from "@/components/layout/providers";
import "@/style/globals.css";
import { auth } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <Providers session={session}>
        <Toaster richColors />
        <body className={inter.className}>{children}</body>
      </Providers>
    </html>
  );
}
