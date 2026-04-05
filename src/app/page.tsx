import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import IndustriesSection from "@/components/IndustriesSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ManifestoSection />
      <IndustriesSection />
      <Footer />
    </main>
  );
}
