import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResearchContent from "./content";

export const metadata: Metadata = {
  title: "Research — Sunder",
  description: "Exploring a new class of responsive matter.",
};

export default function ResearchPage() {
  return (
    <main>
      <div className="relative z-10 pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_[data-cursor='expand']]:pointer-events-auto [&_nav]:pointer-events-auto">
        <Navbar />
        <ResearchContent />
        <Footer />
      </div>
    </main>
  );
}
