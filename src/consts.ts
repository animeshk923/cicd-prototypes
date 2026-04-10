import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "Animesh's Blog",
  DESCRIPTION:
    "Personal Blog to write about tech articles and general life experiences.",
  EMAIL: "kumaranimesh923@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_PROJECTS_ON_HOMEPAGE: 2,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Homepage.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Collection of articles on various tech topics.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "Collection of my projects with links to repositories and live demos.",
};

export const JOTTING: Metadata = {
  TITLE: "Jotting",
  DESCRIPTION: "Raw thoughts and quick notes.",
};

export const SOCIALS: Socials = [
  {
    NAME: "X (formerly Twitter)",
    HREF: "https://twitter.com/animeshk923",
  },
  {
    NAME: "GitHub",
    HREF: "https://github.com/animeshk923",
  },
  {
    NAME: "Website",
    HREF: "https://animeshk923.me",
  },
  {
    NAME: "LinkedIn",
    HREF: "https://linkedin.com/in/animeshkumar923",
  },
];
