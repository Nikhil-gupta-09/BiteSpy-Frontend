import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NewsCarousel from "@/components/NewsCarousel";
import ClaimForm from "@/components/ClaimForm";
import Footer from "@/components/Footer";
import LiveSessions from "@/components/LiveSessions";
import OurMotivation from "@/components/OurMotivation";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <NewsCarousel />
      <ClaimForm />
      <LiveSessions />
      <OurMotivation />
      <Footer />
    </main>
  );
}
