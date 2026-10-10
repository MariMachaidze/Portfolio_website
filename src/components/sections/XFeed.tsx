import { profile } from "../../data/profile";
import { XIcon } from "../icons/XIcon";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function XFeed() {
  return (
    <section className="py-20">
      <Container className="max-w-2xl text-center">
        <SectionHeading eyebrow="Stay in touch" title="Find me on X" align="center" />
        <p className="mb-6 text-muted">I post about what I&apos;m building and learning &mdash; come say hi.</p>
        <Button as="a" href={profile.social.twitter} target="_blank" rel="noreferrer">
          <XIcon size={16} />
          Follow @{profile.social.twitterHandle}
        </Button>
      </Container>
    </section>
  );
}
