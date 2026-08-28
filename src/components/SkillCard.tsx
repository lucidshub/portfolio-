import type { ReactNode } from "react";

export function SkillCard({
  label,
  sub,
  icon,
}: {
  label: string;
  sub: string;
  icon: ReactNode;
}) {
  return (
    <div className="card">
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
      </div>
    </div>
  );
}
