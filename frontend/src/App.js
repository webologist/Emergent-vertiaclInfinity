import { useEffect } from "react";
import "@/App.css";
import Lenis from "lenis";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import FocusedAreas from "@/components/sections/FocusedAreas";
import SMEsMarquee from "@/components/sections/SMEsMarquee";
import Growth from "@/components/sections/Growth";
import CaseStudies from "@/components/sections/CaseStudies";
import Journey from "@/components/sections/Journey";
import Team from "@/components/sections/Team";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import Admin from "@/pages/Admin";
import { ThemeProvider, useTheme } from "@/lib/theme";

function Home() {
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
    <>
      <Nav />
      <main>
        <Hero />
        <FocusedAreas />
        <SMEsMarquee />
        <Growth />
        <CaseStudies />
        <Journey />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster position="bottom-right" theme={theme} richColors />;
}

function App() {
  return (
    <ThemeProvider>
      <div className="App bg-ink font-body text-white antialiased">
        <div className="noise-overlay" aria-hidden="true" />
        <BrowserRouter>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
        <ThemedToaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
