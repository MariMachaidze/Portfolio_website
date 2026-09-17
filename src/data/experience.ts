import type { ExperienceEntry } from "../types";

// EDIT ME: replace with your real job history, most recent first.
export const experience: ExperienceEntry[] = [
  {
    id: "northwind-labs",
    role: "Senior Frontend Engineer",
    company: "Northwind Labs",
    companyUrl: "https://example.com",
    startDate: "2023-03",
    endDate: "Present",
    location: "Austin, TX",
    locationType: "Hybrid",
    summary:
      "Lead frontend architecture for a fintech dashboard used by 50k+ monthly users.",
    bullets: [
      "Rebuilt the core dashboard for performance, cutting time-to-interactive by 45%.",
      "Designed and shipped a shared component library adopted across 3 product teams.",
      "Mentored 2 junior engineers through onboarding and their first production launches.",
    ],
    tech: ["React", "TypeScript", "Tailwind CSS", "GraphQL"],
  },
  {
    id: "bright-path-analytics",
    role: "Software Engineer",
    company: "Bright Path Analytics",
    startDate: "2021-06",
    endDate: "2023-02",
    location: "Remote",
    locationType: "Remote",
    summary: "Built a self-serve reporting tool for mid-market customers.",
    bullets: [
      "Migrated a legacy jQuery admin panel to React + Vite, improving maintainability.",
      "Cut CI/CD pipeline time from 30 minutes to 4 minutes via caching and parallel jobs.",
      "Introduced automated testing, raising coverage from under 10% to over 70%.",
    ],
    tech: ["Node.js", "React", "PostgreSQL", "Docker"],
  },
  {
    id: "studio-coral",
    role: "Junior Web Developer",
    company: "Studio Coral",
    startDate: "2019-08",
    endDate: "2021-05",
    location: "Austin, TX",
    locationType: "On-site",
    summary: "Built marketing sites and e-commerce integrations for small businesses.",
    bullets: [
      "Delivered 15+ marketing sites from Figma designs to production.",
      "Integrated Stripe checkout flows for 6 client storefronts.",
      "Improved average Lighthouse performance scores from 62 to 91.",
    ],
    tech: ["JavaScript", "Sass", "WordPress", "Stripe"],
  },
];
