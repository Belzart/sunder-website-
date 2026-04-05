import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AccessContent from "./content";

export const metadata: Metadata = {
  title: "Access — Sunder",
  description: "Request access to the Sunder research interface.",
};

export default function AccessPage() {
  return (
    <main>
      <div className="relative z-10 pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_[data-cursor='expand']]:pointer-events-auto [&_nav]:pointer-events-auto">
        <Navbar />
        <AccessContent />
        <Footer />
      </div>
    </main>
  );
}
