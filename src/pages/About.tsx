import { Page } from "../components/Page";

export function About() {
  return (
    <Page page="about">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-28">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-widest text-white/50">
          about me
        </p>
        <p className="font-display text-[clamp(1.6rem,4vw,2.8rem)] leading-snug text-white">
          I'm a 2nd-year AI &amp; Data Science student who's still learning how
          development actually works — mostly by building small things and seeing
          what breaks.
        </p>
        <p className="mt-6 max-w-xl text-white/75">
          I'm not an expert and I'm not pretending to be one. I like figuring
          stuff out, shipping messy first versions, and getting a little better
          each time. This site is one of those attempts.
        </p>
      </section>
    </Page>
  );
}
