// Vertical Infinity brand mark.
export const Logo = ({ size = 28, className = "" }) => (
  <img
    src="/vi-logo.png"
    width={size}
    height={size}
    className={className}
    style={{ height: size, width: "auto", objectFit: "contain" }}
    alt="Vertical Infinity"
    draggable={false}
  />
);

// Full horizontal logo (mark + wordmark). Two files so the lettering stays legible in both themes:
// dark grey text on light backgrounds, light text when the page is in dark mode.
export const LogoWordmark = ({ className = "h-7" }) => (
  <>
    <img
      src="/vi-logo-horizontal.png"
      className={`${className} w-auto dark:hidden`}
      alt="Vertical Infinity"
      draggable={false}
    />
    <img
      src="/vi-logo-horizontal-dark.png"
      className={`${className} hidden w-auto dark:block`}
      alt="Vertical Infinity"
      draggable={false}
    />
  </>
);
