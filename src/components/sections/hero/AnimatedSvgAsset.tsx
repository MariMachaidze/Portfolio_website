import type { SyntheticEvent } from "react";

type AnimatedSvgAssetProps = {
  src: string;
  viewBox: string;
};

/**
 * Embeds an SVG via <object> and, once loaded, flips its top-level
 * `opacity="0"` group to visible and pins its viewBox/aspect ratio — a
 * workaround for a Figma-export quirk that bakes a hidden "before" state
 * into the file. Carries no animation logic itself; the fish-leap/splash/
 * ripple motion comes from CSS keyframes in heroIllustration.css.
 */
export default function AnimatedSvgAsset({ src, viewBox }: AnimatedSvgAssetProps) {
  const prepareArtwork = (event: SyntheticEvent<HTMLObjectElement>) => {
    const svg = event.currentTarget.contentDocument?.querySelector<SVGSVGElement>("svg");
    svg?.querySelector<SVGGElement>(":scope > g[opacity='0']")?.setAttribute("opacity", "1");
    svg?.setAttribute("viewBox", viewBox);
    svg?.setAttribute("preserveAspectRatio", "xMidYMid meet");
  };

  return (
    <object
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 block size-full max-w-none"
      data={src}
      onLoad={prepareArtwork}
      tabIndex={-1}
      type="image/svg+xml"
    />
  );
}
