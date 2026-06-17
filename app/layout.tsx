import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "FitAgent",
  description: "AIパーソナルトレーニング SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={cn("h-full", "font-sans", geist.variable)}>
      <body className="min-h-full bg-bg text-text antialiased">{children}</body>
    </html>
  );
}
