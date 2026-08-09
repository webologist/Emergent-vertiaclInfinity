import { motion } from "framer-motion";

// Scroll-reveal wrapper with a masked upward slide.
export const Reveal = ({ children, delay = 0, y = 28, className = "", once = true }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, margin: "-80px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// Staggered container for lists.
export const StaggerGroup = ({ children, className = "", stagger = 0.12, once = true }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once, margin: "-80px" }}
    variants={{
      hidden: {},
      show: { transition: { staggerChildren: stagger } },
    }}
  >
    {children}
  </motion.div>
);

export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
