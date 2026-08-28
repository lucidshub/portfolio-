import { Page } from "../components/Page";

export function Home({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <Page page="home">
      <section
        id="home"
        className="flex min-h-screen flex-col items-center justify-center px-5 text-center"
      >
        <h1 className="font-display text-[clamp(3rem,13vw,10rem)] leading-[0.85] text-white">
          Shubham
          <br />
          Bhandare
        </h1>
        <p className="mt-6 font-mono text-sm uppercase tracking-[0.25em] text-white/80 sm:text-base">
          AI&amp;DS Student
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate("contact")}
            className="rounded-full border border-white/40 px-5 py-2 font-mono text-xs uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
          >
            get in touch
          </button>
          <a
            href="https://github.com/lucidshub"
            data-cursor="open"
            className="font-mono text-xs uppercase tracking-widest text-white/70 underline-offset-4 hover:text-white hover:underline"
          >
            github
          </a>
        </div>
      </section>
    </Page>
  );
}
