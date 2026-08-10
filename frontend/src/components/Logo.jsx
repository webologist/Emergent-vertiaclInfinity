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
