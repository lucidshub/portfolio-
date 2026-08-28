import { useEffect, useRef, useState } from "react";
import { playKey } from "../lib/sound";
import { projects } from "../data/projects";

type Line = { text: string; cls?: "cmd" | "out" | "hint" | "link" | "err"; link?: string };

const DEMO = [
  {
    cmd: "npx shadcn@latest init",
    out: [
      "✔ Preflight checks passed.",
      "✔ Created components.json",
      "✔ Initialized project.",
    ],
  },
  { cmd: "npm install motion", out: ["added 1 package in 2s"] },
  {
    cmd: "npx shadcn@latest add button card",
    out: ["✔ Done. Installed button, card."],
  },
  { cmd: "Term Deez Nuts", out: [] as string[] },
];

const clsOf = (c?: Line["cls"]) => {
  switch (c) {
    case "cmd":
      return "text-white";
    case "out":
      return "text-white/70";
    case "hint":
      return "text-amber-300/70";
    case "link":
      return "text-cyan-300 underline decoration-dotted hover:text-cyan-200 cursor-pointer";
    case "err":
      return "text-red-400";
    default:
      return "text-white/70";
  }
};

export function Terminal({
  onNavigate,
  onClose,
}: {
  onNavigate?: (p: string) => void;
  onClose?: () => void;
}) {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cancelled = useRef(false);

  const push = (l: Line | Line[]) =>
    setLines((prev) => [...prev, ...(Array.isArray(l) ? l : [l])]);
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  useEffect(() => {
    cancelled.current = false;
    (async () => {
      await sleep(400);
      for (const step of DEMO) {
        if (cancelled.current) return;
        let typed = "";
        for (const ch of step.cmd) {
          if (cancelled.current) return;
          typed += ch;
          setLines((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last && last.cls === "cmd" && !last.link) {
              copy[copy.length - 1] = { text: "visitor@shubham:~$ " + typed, cls: "cmd" };
            } else {
              copy.push({ text: "visitor@shubham:~$ " + typed, cls: "cmd" });
            }
            return copy;
          });
          await sleep(45);
        }
        playKey();
        if (step.out.length) {
          await sleep(350);
          push(step.out.map((o) => ({ text: o, cls: "out" as const })));
        }
        await sleep(650);
      }
      if (!cancelled.current) {
        push({ text: "type 'help' to see what I can do.", cls: "hint" });
        setBusy(false);
      }
    })();
    return () => {
      cancelled.current = true;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    push({ text: "visitor@shubham:~$ " + raw, cls: "cmd" });
    if (!cmd) return;
    if (cmd === "clear") {
      setLines([]);
      return;
    }
    if (cmd === "help") {
      push([
        { text: "available commands:", cls: "out" },
        { text: "  projects  — list what I've built (links open on click)", cls: "out" },
        { text: "  about     — who I am", cls: "out" },
        { text: "  learning  — what I'm studying", cls: "out" },
        { text: "  contact   — how to reach me", cls: "out" },
        { text: "  clear     — wipe the screen", cls: "out" },
      ]);
      return;
    }
    if (cmd === "projects") {
      push({ text: "projects:", cls: "out" });
      if (projects.length === 0) push({ text: "  (none added yet)", cls: "out" });
      projects.forEach((p) =>
        push({
          text: `  → ${p.name}${p.link ? "  (" + p.link + ")" : ""}`,
          cls: "link",
          link: p.link,
        })
      );
      return;
    }
    if (["about", "learning", "contact", "home", "projects"].includes(cmd)) {
      push({ text: `navigating to ${cmd}…`, cls: "out" });
      onNavigate?.(cmd);
      return;
    }
    push({ text: `command not found: ${raw}  (try 'help')`, cls: "err" });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playKey();
    run(input);
    setInput("");
  };

  return (
    <div className="rounded-xl border border-white/15 bg-black/40 font-mono text-sm shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
        <span 
          className="h-3 w-3 rounded-full bg-red-500/70 cursor-pointer hover:bg-red-400" 
          onClick={onClose}
        />
        <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
        <span className="h-3 w-3 rounded-full bg-green-500/70" />
        <span className="ml-2 text-[11px] uppercase tracking-widest text-white/40">
          shubham@portfolio
        </span>
      </div>

      <div
        ref={scrollRef}
        className="h-72 overflow-y-auto px-4 py-3 leading-relaxed"
        onClick={() => document.getElementById("term-input")?.focus()}
      >
        {lines.map((l, i) => (
          <div
            key={i}
            className={clsOf(l.cls)}
            onClick={l.link ? () => window.open(l.link, "_blank", "noopener") : undefined}
          >
            {l.text || " "}
          </div>
        ))}

        {!busy && (
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <span className="text-white/80">visitor@shubham:~$</span>
            <input
              id="term-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                playKey();
              }}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              className="flex-1 bg-transparent text-white outline-none"
            />
          </form>
        )}
      </div>
    </div>
  );
}
