import { SiteProvider } from "@/context/SiteContext";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import QuemSomos from "@/components/landing/QuemSomos";
import OQueFazemos from "@/components/landing/OQueFazemos";
import AcoesSociais from "@/components/landing/AcoesSociais";
import Galeria from "@/components/landing/Galeria";
import InstagramFeed from "@/components/landing/InstagramFeed";
import ComoAjudar from "@/components/landing/ComoAjudar";
import Contato from "@/components/landing/Contato";

export default function LandingPage() {
  return (
    <SiteProvider>
      <Navbar />
      <main data-testid="landing-page">
        <Hero />
        <QuemSomos />
        <OQueFazemos />
        <AcoesSociais />
        <Galeria />
        <InstagramFeed />
        <ComoAjudar />
        <Contato />
      </main>
    </SiteProvider>
  );
}
