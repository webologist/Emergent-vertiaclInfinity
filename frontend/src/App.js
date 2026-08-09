import { useEffect } from "react";
import "@/App.css";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import FocusedAreas from "@/components/sections/FocusedAreas";
import SMEsMarquee from "@/components/sections/SMEsMarquee";
import Growth from "@/components/sections/Growth";
import Journey from "@/components/sections/Journey";
import Team from "@/components/sections/Team";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <div className="App bg-ink font-body text-white antialiased">
      <div className="noise-overlay" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <FocusedAreas />
        <SMEsMarquee />
        <Growth />
        <Journey />
        <Team />
        <Contact />
      </main>
      <Footer />
      <Toaster position="bottom-right" theme="dark" richColors />
    </div>
  );
}

export default App;
