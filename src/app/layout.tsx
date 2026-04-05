import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import FieldShell from "@/components/FieldShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sunder — The Future is Material",
  description:
    "Engineering matter that responds — for robotics, space, defense, and energy.",
  openGraph: {
    title: "Sunder",
    description: "The future is material.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="bg-[#0A0A0A] text-white font-[family-name:var(--font-inter)]">
        <CustomCursor />
        <FieldShell>{children}</FieldShell>
      </body>
    </html>
  );
}
