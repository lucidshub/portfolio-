import { useState } from "react";
import { Page } from "../components/Page";
import { Terminal } from "../components/Terminal";
import TerminalButton from "../components/TerminalButton";
import { projects } from "../data/projects";

export function Projects({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Page page="projects">
      <section className="mx-auto max-w-3xl px-5 py-28">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-widest text-white/50">
          projects
        </p>
        <h2 className="font-display text-[clamp(2rem,6vw,4rem)] leading-[0.95] text-white">
          things I've built
        </h2>
        <p className="mt-4 max-w-xl text-white/75">
          Not a huge list yet — just real stuff I actually shipped. More soon.
        </p>

        <div className="mt-10 space-y-4">
          {projects.map((p) => (
            <div
              key={p.name}
              className="rounded-xl border border-white/15 bg-white/[0.03] p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-2xl text-white">{p.name}</h3>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="open"
                    className="font-mono text-[11px] uppercase tracking-widest text-cyan-300 underline-offset-4 hover:underline"
                  >
                    visit ↗
                  </a>
                )}
              </div>
              <p className="mt-2 max-w-xl text-sm text-white/75">{p.description}</p>
              {p.members && (
                <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-white/50">
                  group project ·{" "}
                  {p.members.map((m, i) => (
                    <span key={m.name}>
                      {m.link ? (
                        <a
                          href={m.link}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor="open"
                          className="text-cyan-300 underline-offset-4 hover:underline"
                        >
                          {m.name}
                        </a>
                      ) : (
                        <span className="text-white/70">{m.name}</span>
                      )}
                      {i < p.members!.length - 1 ? " · " : ""}
                    </span>
                  ))}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-14">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
              or just ask the terminal
            </span>
            <TerminalButton 
              onOpen={() => setOpen((o) => !o)} 
              text={open ? "hide terminal" : "terminal"} 
            />
          </div>
          {open && <Terminal onClose={() => setOpen(false)} />}
        </div>
      </section>
    </Page>
  );
}
