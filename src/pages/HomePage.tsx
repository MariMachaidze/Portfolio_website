import { Contact } from "../components/sections/Contact";
import { Experience } from "../components/sections/Experience";
import { GithubActivity } from "../components/sections/GithubActivity";
import { Hero } from "../components/sections/Hero";
import { Projects } from "../components/sections/Projects";
import { Skills } from "../components/sections/Skills";
import { XFeed } from "../components/sections/XFeed";
import { useHashScroll } from "../hooks/useHashScroll";

export function HomePage() {
  useHashScroll();

  return (
    <>
      <Hero />
      <Skills />
      <Experience />
      <Projects />
      <XFeed />
      <GithubActivity />
      <Contact />
    </>
  );
}
