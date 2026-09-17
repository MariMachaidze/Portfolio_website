import { useEffect } from "react";
import { profile } from "../../data/profile";
import { useTheme } from "../../hooks/useTheme";
import { loadTwitterWidget } from "../../lib/twitterWidget";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function XFeed() {
  const { theme } = useTheme();
  const handle = profile.social.twitterHandle;

  useEffect(() => {
    loadTwitterWidget().then(() => {
      window.twttr?.widgets?.load();
    });
  }, [theme]);

  return (
    <section className="py-20">
      <Container className="max-w-2xl">
        <SectionHeading eyebrow="Recent posts" title="Latest on X" align="center" />

        <div key={theme} className="mx-auto">
          <a
            className="twitter-timeline"
            data-theme={theme}
            data-chrome="noheader nofooter transparent"
            data-height="600"
            href={`https://twitter.com/${handle}?ref_src=twsrc%5Etfw`}
          >
            Tweets by @{handle}
          </a>
        </div>
      </Container>
    </section>
  );
}
