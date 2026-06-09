import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="ja" className="h-full">
      <body className="min-h-full bg-bg text-text antialiased">{children}</body>
    </html>
  );
}
