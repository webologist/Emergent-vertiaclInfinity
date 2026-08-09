// Smooth-scroll helper backed by the shared Lenis instance.
export const scrollToId = (href) => {
  const id = href.startsWith("#") ? href.slice(1) : href;
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -10, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
};
