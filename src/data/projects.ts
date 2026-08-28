export type Member = { name: string; link?: string };

export type Project = {
  name: string;
  description: string;
  members?: Member[];
  tech?: string[];
  link?: string;
};

// Add your real projects here. CampusFind is a real, shipped group project.
export const projects: Project[] = [
  {
    name: "CampusFind",
    description:
      "A group project I built with two teammates — a live web app we designed, built, and deployed together.",
    members: [
      { name: "Abdul Mallebhari", link: "https://portfolio-rosy-psi-96.vercel.app" },
      { name: "Vedant Lende" },
    ],
    link: "https://campusfind-ruddy.vercel.app/",
  },
];
