import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ThesisSection from "@/components/ThesisSection";
import DomainsSection from "@/components/DomainsSection";
import PropertiesSection from "@/components/PropertiesSection";
import AccessSection from "@/components/AccessSection";
import ManifestoFragment from "@/components/ManifestoFragment";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      {/* Content layers — sit above the blob + field systems */}
      <div className="relative z-10 pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_[data-cursor='expand']]:pointer-events-auto [&_nav]:pointer-events-auto">
        <Navbar />
        <HeroSection />
        <ThesisSection />
        <ManifestoFragment text="Every surface is a decision." />
        <DomainsSection />
        <ManifestoFragment text="What if materials could think?" />
        <PropertiesSection />
        <ManifestoFragment text="Form follows force." />
        <AccessSection />
        <Footer />
      </div>
    </main>
  );
}
