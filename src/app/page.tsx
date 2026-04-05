import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import IndustriesSection from "@/components/IndustriesSection";
import Footer from "@/components/Footer";
import SphereBackground from "@/components/SphereBackground";

export default function Home() {
  return (
    <main>
      {/* Fixed 3D background — always visible behind content */}
      <SphereBackground />

      {/* Content layers — sit above the sphere */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <ManifestoSection />
        <IndustriesSection />
        <Footer />
      </div>
    </main>
  );
}
