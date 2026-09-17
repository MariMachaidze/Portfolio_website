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

  return (
    <footer className="border-t border-border bg-surface-alt">
      <Container className="flex flex-col items-center gap-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-heading text-lg font-semibold text-text">{profile.name}</p>
          <p className="text-sm text-muted">{profile.role}</p>
        </div>

        <div className="flex items-center gap-4">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              aria-label={label}
              className="text-muted transition-colors duration-200 hover:text-primary"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        <p className="text-sm text-muted">
          &copy; {year} {profile.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
