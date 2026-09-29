import { useEffect } from "react";
import "@/App.css";
import Lenis from "lenis";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import FocusedAreas from "@/components/sections/FocusedAreas";
import SMEsMarquee from "@/components/sections/SMEsMarquee";
import Growth from "@/components/sections/Growth";
import Journey from "@/components/sections/Journey";
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
import LegalPage from "@/pages/LegalPage";
import GoogleReviews from "@/components/sections/GoogleReviews";
import ServiceFinder from "@/components/sections/ServiceFinder";
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/data/legal";
import { ContentProvider } from "@/cms/CmsContext";
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
      <link rel="canonical" href="https://verticalinfinity.in/" />
      <Nav />
      <main>
        <Hero />
        <FocusedAreas />
        <ServiceFinder />
        <SMEsMarquee />
        <Growth />
        <Journey />
        <GoogleReviews slug="home" />
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

// Fires a GA4 page_view on each SPA route change.
function AnalyticsTracker() {
  const location = useLocation();
  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [location.pathname, location.search]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

// Router-agnostic tree: wrapped by BrowserRouter on the client and StaticRouter at prerender time.
export function AppInner() {
  return (
    <ThemeProvider>
      <ContentProvider>
      <div className="App bg-ink font-body text-white antialiased">
        <div className="noise-overlay" aria-hidden="true" />
        <AnalyticsTracker />
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
          <Route path="/privacy-policy" element={<LegalPage page={PRIVACY_POLICY} />} />
          <Route path="/terms-of-service" element={<LegalPage page={TERMS_OF_SERVICE} />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <ThemedToaster />
      </div>
      </ContentProvider>
    </ThemeProvider>
  );
}

export default App;
