import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ClaimForm from "@/components/ClaimForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ClaimForm />
      <Footer />
    </main>
  );
}
