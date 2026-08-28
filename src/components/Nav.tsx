const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "learning", label: "Learning" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export function Nav({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 px-3 py-3 sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-white/15 bg-black/40 px-3 py-2 backdrop-blur-md sm:px-5">
        <button
          onClick={() => onNavigate("home")}
          className="hidden shrink-0 font-mono text-xs uppercase tracking-widest text-white sm:block"
        >
          shubham.
        </button>
        <ul className="flex flex-1 items-center justify-between gap-1 overflow-x-auto whitespace-nowrap font-mono text-[10px] uppercase tracking-widest sm:gap-2 sm:text-[11px]">
          {LINKS.map((l) => {
            const isActive = active === l.id;
            return (
              <li key={l.id} className="shrink-0">
                <button
                  onClick={() => onNavigate(l.id)}
                  className={`rounded-full px-3 py-1.5 transition-colors ${
                    isActive
                      ? "bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.45)]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {l.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
