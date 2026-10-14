import { profile } from "../../../data/profile";

interface HeroSocialLinksProps {
  gap: number;
  iconSize: number;
  githubSrc: string;
  linkedinSrc: string;
  xSrc: string;
  mailSrc: string;
  frameSrc: string;
}

/** The hero illustration's four "doodle" social icons, wired to real profile links. */
export function HeroSocialLinks({ gap, iconSize, githubSrc, linkedinSrc, xSrc, mailSrc, frameSrc }: HeroSocialLinksProps) {
  const { social } = profile;

  return (
    <div className="content-stretch flex items-start overflow-clip relative shrink-0" style={{ gap }} data-name="Social links">
      <a
        href={social.github}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="relative shrink-0 block"
        style={{ width: iconSize, height: iconSize }}
        data-name="GitHub — doodle link"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={githubSrc} />
      </a>
      <a
        href={social.linkedin}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
        className="relative shrink-0 block"
        style={{ width: iconSize, height: iconSize }}
        data-name="LinkedIn — doodle link"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={linkedinSrc} />
      </a>
      <a
        href={social.twitter}
        target="_blank"
        rel="noreferrer"
        aria-label="X (Twitter)"
        className="relative shrink-0 block"
        style={{ width: iconSize, height: iconSize }}
        data-name="X — doodle link"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={xSrc} />
      </a>
      <a
        href={`mailto:${social.email}`}
        aria-label="Email"
        className="bg-[#102944] content-stretch flex items-center justify-center relative rounded-[999px] shrink-0"
        style={{ width: iconSize, height: iconSize }}
        data-name="Email — doodle link"
      >
        <div className="relative shrink-0 size-[18px]" data-name="mail">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={mailSrc} />
        </div>
        <div className="absolute left-0 top-0" style={{ width: iconSize, height: iconSize }} data-name="Hand-sketched link frame">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={frameSrc} />
        </div>
      </a>
    </div>
  );
}
