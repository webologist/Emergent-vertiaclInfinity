import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { CONTACT as CONTACT_DEFAULT } from "@/data/content";
import { useContent } from "@/cms/CmsContext";

const WA_TEXT = encodeURIComponent("Hi Vertical Infinity, I'd like to discuss a project.");

// Floating WhatsApp chat button, shown on every public page (bottom-right corner).
// The number comes from CONTACT.whatsapp so it stays in sync with the contact section.
export function WhatsAppFloat() {
  const { pathname } = useLocation();
  const CONTACT = useContent("contact", CONTACT_DEFAULT);
  if (pathname.startsWith("/admin")) return null;

  const number = String(CONTACT.whatsapp).replace(/\D/g, "");

  return (
    <motion.a
      href={`https://wa.me/${number}?text=${WA_TEXT}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 24, delay: 0.8 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="group fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-cwhite shadow-lg shadow-[#25D366]/40 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink md:bottom-8 md:right-8"
      aria-label="Chat with us on WhatsApp"
      data-testid="whatsapp-float-btn"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-50 motion-safe:animate-ping [animation-duration:2.4s]"
      />
      <MessageCircle aria-hidden="true" size={24} className="relative fill-cwhite/20" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full border border-white/10 bg-elevated px-3.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
      >
        Chat on WhatsApp
      </span>
    </motion.a>
  );
}
