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

  // Light-blue palette from the Projects section (projectsShowcase.css):
  // paper #a8c0db, ink #11120f, accent #3e5975 and its --line mix (#738394).
  // Muted is the Projects #4b5c6d darkened to #3f4d5b (same hue) so small text
  // clears 4.5:1 on the paper. Fixed regardless of site theme, like the Hero.
  return (
    <footer className="border-t border-[#738394] bg-[#a8c0db]">
      <Container className="flex flex-col items-center gap-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-heading text-lg font-semibold text-[#11120f]">{profile.name}</p>
          <p className="text-sm text-[#3f4d5b]">{profile.role}</p>
        </div>

        <div className="flex items-center gap-4">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              aria-label={label}
              className="text-[#3e5975] transition-colors duration-200 hover:text-[#11120f] focus-visible:text-[#11120f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#11120f]"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        <p className="text-sm text-[#3f4d5b]">
          &copy; {year} {profile.name}. All rights reserved.
        </p>
      </Container>

      <p className="border-t border-[#738394] py-3 text-center text-xs text-[#3f4d5b]">
        🚧 This site is a work in progress — thanks for your patience while I keep building it out.
      </p>
    </footer>
  );
}
