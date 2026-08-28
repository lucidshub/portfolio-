import { Page } from "../components/Page";
import { ContactCard } from "../components/ContactCard";

const GitHubIcon = (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="white" aria-hidden>
    <path d="M12 .5A11.5 11.5 0 0 0 .5 12 11.5 11.5 0 0 0 8.4 23c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17 4.6 18 4.9 18 4.9c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

const LinkedInIcon = (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="white" aria-hidden>
    <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.2 8.3h4.6V24H.2V8.3Zm7.3 0h4.4v2.1h.1c.6-1.1 2.1-2.3 4.3-2.3 4.6 0 5.4 3 5.4 6.9V24h-4.6v-6.9c0-1.6 0-3.7-2.3-3.7s-2.6 1.8-2.6 3.6V24H7.5V8.3Z" />
  </svg>
);

const MailIcon = (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" aria-hidden>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
    <path d="m3 6 9 6 9-6" />
  </svg>
);

export function Contact() {
  return (
    <Page page="contact">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-28">
        <p className="mb-8 font-mono text-[11px] uppercase tracking-widest text-white/50">
          contact
        </p>
        <h2 className="font-display text-[clamp(2.2rem,7vw,5rem)] leading-[0.9] text-white">
          say hi.
        </h2>
        <p className="mt-4 max-w-md text-white/75">
          Open to hackathon teams, dumb ideas, or just trading notes as students.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-6 sm:justify-start">
          <ContactCard href="https://github.com/lucidshub" label="GitHub" sub="@lucidshub" icon={GitHubIcon} />
          <ContactCard href="https://www.linkedin.com/in/shubham-bhandare-b3a3053b2" label="LinkedIn" sub="in/shubham-bhandare-b3a3053b2" icon={LinkedInIcon} />
          <ContactCard href="mailto:shubhambhandare2008@gmail.com" label="Email" sub="shubhambhandare2008@gmail.com" icon={MailIcon} />
        </div>
      </section>
    </Page>
  );
}
