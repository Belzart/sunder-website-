"use client";

import BrandHero from "@/components/brand/BrandHero";
import BrandLogo from "@/components/brand/BrandLogo";
import BrandColors from "@/components/brand/BrandColors";
import BrandTypography from "@/components/brand/BrandTypography";
import BrandGuidelines from "@/components/brand/BrandGuidelines";

export default function BrandPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Subtle top gradient */}
      <div
        className="fixed inset-x-0 top-0 h-px z-50"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
      />

      <div className="divide-y divide-white/[0.04]">
        <BrandHero />
        <BrandLogo />
        <BrandColors />
        <BrandTypography />
        <BrandGuidelines />
      </div>
    </main>
  );
}
