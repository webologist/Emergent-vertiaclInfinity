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
import Journey from "@/components/sections/Journey";
import Team from "@/components/sections/Team";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import Admin from "@/pages/Admin";
import ProductDevelopment from "@/pages/ProductDevelopment";
import WorkflowAutomation from "@/pages/WorkflowAutomation";
import LegacyModernization from "@/pages/LegacyModernization";
import AiAutomation from "@/pages/AiAutomation";
import ExperienceDesign from "@/pages/ExperienceDesign";
import DigitalCommerce from "@/pages/DigitalCommerce";
import PerformanceServices from "@/pages/PerformanceServices";
import ManagedSupport from "@/pages/ManagedSupport";
import { ThemeProvider, useTheme } from "@/lib/theme";
import { ScrollToTop } from "@/components/ScrollToTop";

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
    // Scroll to hash target when arriving from an inner page (e.g. /#focus).
    if (window.location.hash) {
      const id = window.location.hash;
      setTimeout(() => {
        const el = document.getElementById(id.slice(1));
        if (el) lenis.scrollTo(el, { offset: -10, duration: 1 });
      }, 300);
    }
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
        <Journey />
        <Team />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
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
            <Route path="/product-development" element={<ProductDevelopment />} />
            <Route path="/workflow-automation" element={<WorkflowAutomation />} />
            <Route path="/legacy-modernization" element={<LegacyModernization />} />
            <Route path="/ai-automation" element={<AiAutomation />} />
            <Route path="/experience-design" element={<ExperienceDesign />} />
            <Route path="/digital-commerce" element={<DigitalCommerce />} />
            <Route path="/performance-services" element={<PerformanceServices />} />
            <Route path="/managed-support" element={<ManagedSupport />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
        <ThemedToaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
