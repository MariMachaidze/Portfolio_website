import { Mail } from "lucide-react";
import { profile } from "../../data/profile";
import { AvatarPlaceholder } from "../placeholders/AvatarPlaceholder";
import { Container } from "../ui/Container";
import { GithubIcon } from "../icons/GithubIcon";
import { LinkedinIcon } from "../icons/LinkedinIcon";
import { XIcon } from "../icons/XIcon";

export function Hero() {
  const { social } = profile;

  const socialLinks = [
    { href: social.github, label: "GitHub", icon: GithubIcon },
    { href: social.linkedin, label: "LinkedIn", icon: LinkedinIcon },
    { href: social.twitter, label: "X (Twitter)", icon: XIcon },
    { href: `mailto:${social.email}`, label: "Email", icon: Mail },
  ];

  return (
    <section id="hero" className="scroll-mt-16 py-20 sm:py-28">
      <Container className="grid items-center gap-12 md:grid-cols-[1.2fr_0.8fr]">
        <div className="@container">
          {profile.showBadge && profile.badge && (
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {profile.badge}
            </span>
          )}

          <h1 className="whitespace-nowrap text-[clamp(1.5rem,7cqw,3rem)] font-semibold leading-tight text-text">
            Hello, I&apos;m {profile.name}
          </h1>

          <p className="mt-3 text-lg text-muted">
            {profile.role}
            {profile.showYearsExperience && profile.yearsExperience
              ? ` · ${profile.yearsExperience}+ years of experience`
              : ""}
          </p>

          <p className="mt-5 max-w-xl text-muted">{profile.blurb}</p>

          <div className="mt-8 flex items-center gap-4">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors duration-200 hover:border-primary hover:text-primary"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="mx-auto w-48 sm:w-64">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.avatarAlt}
              className="aspect-square w-full rounded-full object-cover drop-shadow-lg"
            />
          ) : (
            <AvatarPlaceholder name={profile.name} className="w-full drop-shadow-lg" />
          )}
        </div>
      </Container>
    </section>
  );
}
