import { Page } from "../components/Page";

const LEARNING = [
  { name: "Python", sub: "Backend", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { name: "HTML", sub: "Markup", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
  { name: "CSS", sub: "Styling", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
  { name: "JavaScript", sub: "Logic", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: "Git", sub: "Version Control", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
  { name: "GitHub", sub: "Collaboration", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" },
  { name: "SQL", sub: "Database", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
];

export function Learning() {
  return (
    <Page page="learning">
      <section className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-5 py-28 relative z-10">
        <p className="mb-8 font-mono text-[11px] uppercase tracking-widest text-white/50">
          learning / skills
        </p>
        <p className="mb-8 max-w-xl text-white/75 text-lg font-light leading-relaxed">
          Stuff I'm currently picking up. Not mastery — just what I'm working with
          right now.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-6 sm:justify-start">
          {LEARNING.map((s) => (
            <div key={s.name} className="card" style={{ width: "160px", height: "240px", position: "relative" }}>
              <div
                className="img"
                style={{
                  top: "20px",
                  left: 0,
                  width: "100%",
                  backgroundImage: `url(${s.img})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
              <div className="textBox">
                <span className="text head">{s.name}</span>
                <span className="price">{s.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Page>
  );
}
