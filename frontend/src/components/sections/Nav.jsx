import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Search, Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";
import { NAV } from "@/data/content";
import { scrollToId } from "@/lib/scroll";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/lib/theme";

const NavMark = () => (
  <div className="flex items-center gap-2.5" data-testid="nav-brand">
    <Logo size={30} />
    <span className="font-display text-[15px] font-bold tracking-tight leading-none">
      Vertical<span className="text-crimson">.</span>Infinity
    </span>
  </div>
);

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href) => {
    setOpen(false);
    const id = href.startsWith("#") ? href.slice(1) : href;
    // Scroll within the current page if the target exists, else route home + hash.
    if (document.getElementById(id)) {
      scrollToId(href);
    } else if (location.pathname !== "/") {
      navigate(`/${href}`);
    } else {
      scrollToId(href);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled ? "border-b border-white/10 bg-black/60 backdrop-blur-xl" : "border-b border-transparent"
        }`}
        data-testid="main-nav"
      >
        <nav className="container-x flex h-[68px] items-center justify-between">
          <button onClick={() => go("#top")} className="cursor-pointer bg-transparent" data-testid="nav-home-btn">
            <NavMark />
          </button>

          <div className="hidden items-center gap-10 md:flex">
            {NAV.links.map((l) => (
              <motion.button
                key={l.href}
                onClick={() => go(l.href)}
                data-testid={`nav-link-${l.href.slice(1)}`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="group relative text-base font-medium text-dim transition-colors duration-300 hover:text-white"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 rounded-full bg-crimson transition-all duration-300 group-hover:w-full" />
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-dim transition-colors duration-300 hover:border-crimson hover:text-white"
              data-testid="theme-toggle-btn"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <Sun size={16} strokeWidth={1.6} /> : <Moon size={16} strokeWidth={1.6} />}
            </button>
            <button
              onClick={() => toast("Search is coming soon — try the nav or reach us below.")}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 text-dim transition-colors duration-300 hover:border-crimson hover:text-white md:flex"
              data-testid="nav-search-btn"
              aria-label="Search"
            >
              <Search size={16} strokeWidth={1.6} />
            </button>
            <button
              onClick={() => go("#contact")}
              data-testid="nav-cta-btn"
              className="group hidden items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-crimson hover:text-cwhite md:flex"
            >
              Start a project
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 md:hidden"
              data-testid="nav-mobile-toggle"
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl md:hidden"
            data-testid="mobile-menu"
          >
            <div className="container-x flex h-full flex-col justify-center gap-8">
              {NAV.links.map((l, i) => (
                <motion.button
                  key={l.href}
                  onClick={() => go(l.href)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i }}
                  className="text-left font-display text-4xl font-bold"
                  data-testid={`mobile-link-${l.href.slice(1)}`}
                >
                  {l.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
