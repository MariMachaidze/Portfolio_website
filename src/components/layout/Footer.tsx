import { Mail } from "lucide-react";
import { profile } from "../../data/profile";
import { GithubIcon } from "../icons/GithubIcon";
import { LinkedinIcon } from "../icons/LinkedinIcon";
import { XIcon } from "../icons/XIcon";
import { Container } from "../ui/Container";

export function Footer() {
  const { social } = profile;
  const year = new Date().getFullYear();

  const links = [
    { href: social.github, label: "GitHub", icon: GithubIcon },
    { href: social.linkedin, label: "LinkedIn", icon: LinkedinIcon },
    { href: social.twitter, label: "X (Twitter)", icon: XIcon },
    { href: `mailto:${social.email}`, label: "Email", icon: Mail },
  ];

  // Hero navy palette (same as .theme-navy in index.css): bg #0b1f3a, cream
  // headline #f5e6d3, light-blue body text #d7e3f0, teal links #82afbf and the
  // #1e3a5f divider. Fixed regardless of site theme, like the Hero.
  return (
    <footer className="border-t border-[#1e3a5f] bg-[#0b1f3a]">
      <Container className="flex flex-col items-center gap-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-heading text-lg font-semibold text-[#f5e6d3]">{profile.name}</p>
          <p className="text-sm text-[#d7e3f0]">{profile.role}</p>
        </div>

        <div className="flex items-center gap-4">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              aria-label={label}
              className="text-[#82afbf] transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5e6d3]"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        <p className="text-sm text-[#d7e3f0]">
          &copy; {year} {profile.name}. All rights reserved.
        </p>
      </Container>

      <p className="border-t border-[#1e3a5f] px-4 py-3 text-center text-xs text-[#d7e3f0]">
        Thank you to my friends Syam and Ömer for the UI design ideas.
      </p>
    </footer>
  );
}
