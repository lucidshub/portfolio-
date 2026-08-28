export type Project = {
  name: string;
  description: string;
  members?: string[];
  tech?: string[];
  link?: string;
};

// Add your real projects here. CampusFind is a real, shipped group project.
export const projects: Project[] = [
  {
    name: "CampusFind",
    description:
      "A group project I built with two teammates — a live web app we designed, built, and deployed together.",
    members: ["Abdul Mallebhari", "Vedant Lende"],
    link: "https://campusfind-ruddy.vercel.app/",
  },
];
