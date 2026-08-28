import type { ReactNode } from "react";

/** Contact link card — your Uiverse hover card, wired to GitHub / LinkedIn / Email. */
export function ContactCard({
  href,
  label,
  sub,
  icon,
}: {
  href: string;
  label: string;
  sub: string;
  icon: ReactNode;
}) {
  return (
    <a
      className="card"
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor="open"
    >
      <div
        className="img"
        style={{
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          margin: "auto",
          width: "72px",
          display: "grid",
          placeItems: "center",
        }}
      >
        {icon}
      </div>
      <div className="textBox">
        <span className="text head">{label}</span>
        <span className="price">{sub}</span>
        <span>open ↗</span>
      </div>
    </a>
  );
}
