import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sunder — The Future is Material",
  description:
    "Solving the material problems of tomorrow for robotics, space, and defense.",
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
        {children}
      </body>
    </html>
  );
}
