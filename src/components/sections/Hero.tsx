import { useRef } from "react";
import { HeroDesktop } from "./hero/HeroDesktop";
import "./hero/heroIllustration.css";
import { HeroMobile } from "./hero/HeroMobile";
import { HeroTablet } from "./hero/HeroTablet";
import { useFishJumpAnimation } from "./hero/useFishJumpAnimation";

export function Hero() {
  const illustrationRef = useRef<HTMLDivElement>(null);
  useFishJumpAnimation(illustrationRef);

  return (
    <section id="hero" className="hero-illustration scroll-mt-16 bg-[#0b1f3a]">
      <div ref={illustrationRef}>
        <div className="mobile-design">
          <HeroMobile />
        </div>
        <div className="tablet-design">
          <HeroTablet />
        </div>
        <div className="desktop-design">
          <HeroDesktop />
        </div>
      </div>
    </section>
  );
}
