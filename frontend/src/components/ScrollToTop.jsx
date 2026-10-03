import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

// Floating scroll-to-top button, appears after the user scrolls down.
// Sits one slot above the WhatsApp button (see WhatsAppFloat.jsx), which owns the corner.
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toTop}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
          className="group fixed bottom-[5.25rem] right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-crimson text-cwhite shadow-lg shadow-crimson/30 transition-colors duration-300 hover:bg-white hover:text-ink md:bottom-[5.75rem] md:right-8"
          aria-label="Scroll back to top"
          data-testid="scroll-to-top-btn"
        >
          <ArrowUp size={20} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
