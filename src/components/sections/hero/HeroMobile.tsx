import { profile } from "../../../data/profile";
import { AvatarPlaceholder } from "../../placeholders/AvatarPlaceholder";
import AnimatedSvgAsset from "./AnimatedSvgAsset";
import { HeroSocialLinks } from "./HeroSocialLinks";

const p = "/assets/mobile";
const imgStatus = `${p}/f40e4.svg`;
const imgGitHubDoodleLink = `${p}/b87ac.svg`;
const imgLinkedInDoodleLink = `${p}/9c669.svg`;
const imgXDoodleLink = `${p}/a5a03.svg`;
const imgMail = `${p}/f15d2.svg`;
const imgHandSketchedLinkFrame = `${p}/d1bb1.svg`;
const imgDoodleSparkle = `${p}/766de.svg`;
const imgBotanicalHeadshotWreathPencilRingAndLeafyStems = `${p}/2e981.svg`;
const imgLeafSprigsAroundThePortrait = `${p}/98037.svg`;
const imgRoseHandDrawnPetals = `${p}/a5b37.svg`;
const imgFlowerDaisy2 = `${p}/58b72.svg`;
const imgGoldenFlowerHeart2 = `${p}/ad86b.svg`;
const imgPoppyHandDrawnPetals = `${p}/48ffd.svg`;
const imgForgetMeNotHandDrawnPetals = `${p}/69081.svg`;
const imgTulipHandDrawnPetals = `${p}/cc675.svg`;
const imgRoseHandDrawnPetals1 = `${p}/efaf0.svg`;
const imgForgetMeNotHandDrawnPetals1 = `${p}/32b73.svg`;
const imgPoppyHandDrawnPetals1 = `${p}/be652.svg`;
const imgRoseHandDrawnPetals2 = `${p}/69860.svg`;
const imgTulipHandDrawnPetals1 = `${p}/5cbfc.svg`;
const imgFlowerDaisy11 = `${p}/7d996.svg`;
const imgGoldenFlowerHeart11 = `${p}/908b0.svg`;
const imgDoodleStar = `${p}/0fb5b.svg`;
const imgSunshineSoftHalo = `${p}/9259a.svg`;
const imgSunshineLongSketchRays = `${p}/3e0eb.svg`;
const imgSunshineTwinklingRays = `${p}/372fb.svg`;
const imgSmilingPencilSun = `${p}/70568.svg`;
const imgMountainRidgeClearPeaksAndPencilFacets = `${p}/dbabb.svg`;
const imgWoodedHillsContinuousShoreline = `${p}/053bf.svg`;
const imgPineTree1Static = `${p}/23110.svg`;
const imgPineTree2Static = `${p}/6db38.svg`;
const imgPineTree3Static = `${p}/5bfb5.svg`;
const imgPineTree4Static = `${p}/1081b.svg`;
const imgPineTree5Static = `${p}/9c1e1.svg`;
const imgVisibleWindTrail1 = `${p}/478ce.svg`;
const imgVisibleWindTrail2 = `${p}/9e19b.svg`;
const imgVisibleWindTrail3 = `${p}/29718.svg`;
const imgDoodleWavesFarRibbon = `${p}/939a6.svg`;
const imgDoodleWavesWanderingWater = `${p}/27590.svg`;
const imgDoodleFishJumpingOutAndDivingUnder = `${p}/70eab.svg`;
const imgWaterSplashLaunchDroplets = `${p}/71f3e.svg`;
const imgWaterSplashLandingDroplets = `${p}/3af79.svg`;
const imgLandingRippleExpandingRing = `${p}/12817.svg`;
const imgDoodleFish2JumpingLeft = `${p}/beacc.svg`;
const imgWaterSplashLaunchDroplets1 = `${p}/9fb67.svg`;
const imgWaterSplashLandingDroplets1 = `${p}/e6051.svg`;
const imgLandingRippleExpandingRing1 = `${p}/137ec.svg`;
const imgDoodleFish3JumpingLeft = `${p}/cd5bb.svg`;
const imgWaterSplashLaunchDroplets2 = `${p}/a52c7.svg`;
const imgWaterSplashLandingDroplets2 = `${p}/60f4a.svg`;
const imgLandingRippleExpandingRing2 = `${p}/df0f2.svg`;
const imgDoodleWavesForegroundRibbon = `${p}/e7552.svg`;
const imgPencilRippleAccents = `${p}/8a9ca.svg`;
const imgPaperBoat1Sailing = `${p}/bf18c.svg`;
const imgPaperBoat2Sailing = `${p}/51146.svg`;
const imgPaperBoat3Sailing = `${p}/49894.svg`;

export function HeroMobile() {
  return (
    <div className="bg-[#0b1f3a] content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Introduction">
      <div className="absolute bg-gradient-to-b from-[#0a1628] h-[1050px] left-0 to-[#0a1628] top-0 via-50% via-[#0d2348] w-[390px]" data-name="sky-gradient" />
      <div className="content-stretch flex flex-col gap-[40px] items-start justify-center overflow-clip pb-[274px] pt-[72px] px-[24px] relative shrink-0 w-full" data-name="content-wrapper">
        <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Biography">
          {profile.showBadge && profile.badge && (
            <div
              className="bg-[#112240] border border-[rgba(42,107,93,0.3)] border-solid content-stretch flex gap-[8px] items-center overflow-clip px-[12px] py-[4px] relative rounded-[999px] shrink-0"
              data-name="Availability"
            >
              <div className="relative shrink-0 size-[8px]" data-name="Status">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStatus} />
              </div>
              <p className="[word-break:break-word] font-body font-semibold leading-[20px] relative shrink-0 text-[#3dd6a3] text-[14px] whitespace-nowrap">
                {profile.badge}
              </p>
            </div>
          )}
          <div className="content-stretch flex flex-col items-start overflow-clip pt-[24px] relative shrink-0 w-full" data-name="Greeting">
            <p
              className="[word-break:break-word] font-heading font-semibold leading-[30px] relative shrink-0 text-[#f0e6d3] text-[24px] w-full"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >{`Hello, I'm ${profile.name}`}</p>
          </div>
          <div className="content-stretch flex flex-col items-start overflow-clip pt-[12px] relative shrink-0 w-full" data-name="Role">
            <p className="[word-break:break-word] font-body font-normal leading-[28px] relative shrink-0 text-[#9fb4d4] text-[18px] w-full">
              {profile.role}
              {profile.showYearsExperience && profile.yearsExperience ? ` · ${profile.yearsExperience}+ years of experience` : ""}
            </p>
          </div>
          <div className="content-stretch flex flex-col items-start overflow-clip pt-[20px] relative shrink-0 w-full" data-name="Summary">
            <p className="[word-break:break-word] font-body font-normal leading-[24px] relative shrink-0 text-[#7a96ba] text-[15px] w-full">
              {profile.blurb}
            </p>
          </div>
          <div className="content-stretch flex items-start overflow-clip pt-[32px] relative shrink-0" data-name="Social profiles">
            <HeroSocialLinks
              gap={14}
              iconSize={44}
              githubSrc={imgGitHubDoodleLink}
              linkedinSrc={imgLinkedInDoodleLink}
              xSrc={imgXDoodleLink}
              mailSrc={imgMail}
              frameSrc={imgHandSketchedLinkFrame}
            />
          </div>
        </div>
        <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0 w-full" data-name="Portrait area">
          <div className="relative rounded-[999px] shrink-0 size-[220px]" data-name="portrait-doodle-frame">
            <div className="absolute left-[14px] size-[192px] top-[14px] rounded-full overflow-hidden" data-name="Portrait of Mariam Machaidze">
              {profile.avatarUrl ? (
                <img alt={profile.avatarAlt} className="block size-full object-cover" src={profile.avatarUrl} />
              ) : (
                <AvatarPlaceholder name={profile.name} className="size-full" />
              )}
            </div>
            <div className="absolute left-[-13px] size-[20px] top-[40px]" data-name="Doodle sparkle">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDoodleSparkle} />
            </div>
            <div className="absolute left-0 size-[220px] top-0" data-name="Botanical headshot wreath — pencil ring and leafy stems">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBotanicalHeadshotWreathPencilRingAndLeafyStems} />
            </div>
            <div className="absolute left-0 size-[220px] top-0" data-name="Leaf sprigs around the portrait">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLeafSprigsAroundThePortrait} />
            </div>
            <div className="absolute left-[10.02px] size-[32px] top-[35.2px]" data-name="Flower — Rose 1">
              <div className="absolute left-0 size-[32px] top-0" data-name="Rose — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRoseHandDrawnPetals} />
              </div>
            </div>
            <div className="absolute left-[129.36px] size-[24.64px] top-[0.18px]" data-name="Flower — Daisy 2">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFlowerDaisy2} />
            </div>
            <div className="absolute left-[129.36px] size-[24.64px] top-[0.18px]" data-name="Golden flower heart 2">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGoldenFlowerHeart2} />
            </div>
            <div className="absolute left-[180.94px] size-[32px] top-[148.33px]" data-name="Flower — Poppy 3">
              <div className="absolute left-0 size-[32px] top-0" data-name="Poppy — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPoppyHandDrawnPetals} />
              </div>
            </div>
            <div className="absolute left-[133.86px] size-[22.4px] top-[195.14px]" data-name="Flower — Forget-me-not 4">
              <div className="absolute left-0 size-[22.4px] top-0" data-name="Forget-me-not — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgForgetMeNotHandDrawnPetals} />
              </div>
            </div>
            <div className="absolute left-[-6.38px] size-[28px] top-[90.63px]" data-name="Flower — Tulip 5">
              <div className="absolute left-0 size-[28px] top-0" data-name="Tulip — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgTulipHandDrawnPetals} />
              </div>
            </div>
            <div className="absolute left-[47.74px] size-[22px] top-[10.22px]" data-name="Flower — Rose 6">
              <div className="absolute left-0 size-[22px] top-0" data-name="Rose — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRoseHandDrawnPetals1} />
              </div>
            </div>
            <div className="absolute left-[175.53px] size-[26px] top-[31.1px]" data-name="Flower — Forget-me-not 7">
              <div className="absolute left-0 size-[26px] top-0" data-name="Forget-me-not — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgForgetMeNotHandDrawnPetals1} />
              </div>
            </div>
            <div className="absolute left-[200.13px] size-[24px] top-[89.06px]" data-name="Flower — Poppy 8">
              <div className="absolute left-0 size-[24px] top-0" data-name="Poppy — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPoppyHandDrawnPetals1} />
              </div>
            </div>
            <div className="absolute left-[158.7px] size-[26px] top-[178.88px]" data-name="Flower — Rose 9">
              <div className="absolute left-0 size-[26px] top-0" data-name="Rose — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRoseHandDrawnPetals2} />
              </div>
            </div>
            <div className="absolute left-[51.87px] size-[20px] top-[190.52px]" data-name="Flower — Tulip 10">
              <div className="absolute left-0 size-[20px] top-0" data-name="Tulip — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgTulipHandDrawnPetals1} />
              </div>
            </div>
            <div className="absolute left-[6.86px] size-[22px] top-[143.94px]" data-name="Flower — Daisy 11">
              <div className="absolute inset-[-0.17%_-0.91%_0_-0.92%]">
                <img alt="" className="block max-w-none size-full" src={imgFlowerDaisy11} />
              </div>
            </div>
            <div className="absolute left-[6.86px] size-[22px] top-[143.94px]" data-name="Golden flower heart 11">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGoldenFlowerHeart11} />
            </div>
            <div className="absolute left-[222px] size-[13px] top-[125.4px]" data-name="Doodle star">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDoodleStar} />
            </div>
          </div>
          <div className="content-stretch flex flex-col items-center overflow-clip pt-[10px] relative shrink-0 w-full" data-name="portrait-doodle-caption">
            <p className="[word-break:break-word] font-body font-normal leading-[18px] relative shrink-0 text-[#adc4da] text-[12px] whitespace-nowrap">
              ✦ electronics nerd · roboticist · builder ✦
            </p>
          </div>
        </div>
      </div>
      <div className="absolute h-[232px] left-0 overflow-clip top-[818px] w-[390px]" data-name="Doodle landscape — hills, waves and sunshine">
        <div className="absolute left-[188.1px] size-[84px] top-px" data-name="Shining doodle sun">
          <div className="absolute left-0 size-[84px] top-0" data-name="Sunshine — soft halo">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSunshineSoftHalo} />
          </div>
          <div className="absolute left-0 size-[84px] top-0" data-name="Sunshine — long sketch rays">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSunshineLongSketchRays} />
          </div>
          <div className="absolute left-0 size-[84px] top-0" data-name="Sunshine — twinkling rays">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSunshineTwinklingRays} />
          </div>
          <div className="absolute left-0 size-[84px] top-0" data-name="Smiling pencil sun">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSmilingPencilSun} />
          </div>
        </div>
        <div className="absolute h-[232px] left-0 top-0 w-[390px]" data-name="Mountain ridge — clear peaks and pencil facets">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMountainRidgeClearPeaksAndPencilFacets} />
        </div>
        <div className="absolute h-[232px] left-0 top-0 w-[390px]" data-name="Wooded hills — continuous shoreline">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgWoodedHillsContinuousShoreline} />
        </div>
        <div className="absolute h-[232px] left-0 overflow-clip top-0 w-[390px]" data-name="Pencil pine trees along the hills">
          <div className="absolute inset-[36.64%_89.42%_45.69%_5.42%]">
            <div className="absolute inset-[-1.34%_-2.73%_-1.1%_-2.73%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree1Static} />
            </div>
          </div>
          <div className="absolute bottom-1/2 left-[11.99%] right-[83.99%] top-[35.78%]">
            <div className="absolute inset-[-1.67%_-3.51%_-1.36%_-3.51%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree2Static} />
            </div>
          </div>
          <div className="absolute inset-[35.34%_70.21%_51.72%_26.21%]">
            <div className="absolute inset-[-1.83%_-3.93%_-1.5%_-3.93%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree3Static} />
            </div>
          </div>
          <div className="absolute inset-[32.76%_21.7%_51.29%_73.7%]">
            <div className="absolute inset-[-1.49%_-3.07%_-1.22%_-3.07%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree4Static} />
            </div>
          </div>
          <div className="absolute bottom-1/2 left-[88.06%] right-[8.06%] top-[36.21%]">
            <div className="absolute inset-[-1.72%_-3.64%_-1.41%_-3.64%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree5Static} />
            </div>
          </div>
        </div>
        <div className="absolute h-[32px] left-[9.75px] top-[65px] w-[86px]" data-name="Visible wind trail 1">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVisibleWindTrail1} />
        </div>
        <div className="absolute h-[32px] left-[280.8px] top-[61px] w-[86px]" data-name="Visible wind trail 2">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVisibleWindTrail2} />
        </div>
        <div className="absolute h-[32px] left-[144.3px] top-[118px] w-[86px]" data-name="Visible wind trail 3">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVisibleWindTrail3} />
        </div>
        <div className="absolute h-[122px] left-[-130px] top-[110px] w-[650px]" data-name="Doodle waves — far ribbon">
          <div className="absolute inset-[0_-20%_0_-0.12%]">
            <img alt="" className="block max-w-none size-full" src={imgDoodleWavesFarRibbon} />
          </div>
        </div>
        <div className="absolute h-[122px] left-[-152.1px] top-[137px] w-[650px]" data-name="Doodle waves — wandering water">
          <div className="absolute inset-[0_-20%_0_-0.12%]">
            <img alt="" className="block max-w-none size-full" src={imgDoodleWavesWanderingWater} />
          </div>
        </div>
        <div className="absolute h-[152px] left-[144.3px] overflow-clip top-[86px] w-[190px]" data-name="Fish leap — waterline stage">
          <div className="absolute h-[28px] left-[16px] top-[112px] w-[44px]" data-name="Doodle fish — jumping out and diving under">
            <AnimatedSvgAsset src={imgDoodleFishJumpingOutAndDivingUnder} viewBox="0 0 42 32" />
          </div>
          <div className="absolute h-[52px] left-[5px] top-[92px] w-[58px]" data-name="Water splash — launch droplets">
            <AnimatedSvgAsset src={imgWaterSplashLaunchDroplets} viewBox="0 0 54 48" />
          </div>
          <div className="absolute h-[60px] left-[86px] top-[86px] w-[70px]" data-name="Water splash — landing droplets">
            <AnimatedSvgAsset src={imgWaterSplashLandingDroplets} viewBox="0 0 62 54" />
          </div>
          <div className="absolute h-[22px] left-[82px] top-[126px] w-[72px]" data-name="Landing ripple — expanding ring">
            <AnimatedSvgAsset src={imgLandingRippleExpandingRing} viewBox="0 0 72 22" />
          </div>
        </div>
        <div className="absolute flex h-[152px] items-center justify-center left-[15.6px] top-[92px] w-[190px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <div className="h-[152px] overflow-clip relative w-[190px]" data-name="Fish leap — opposite direction 2">
              <div className="absolute h-[28px] left-[16px] top-[112px] w-[44px]" data-name="Doodle fish 2 — jumping left">
                <AnimatedSvgAsset src={imgDoodleFish2JumpingLeft} viewBox="0 0 42 32" />
              </div>
              <div className="absolute h-[52px] left-[5px] top-[92px] w-[58px]" data-name="Water splash — launch droplets">
                <AnimatedSvgAsset src={imgWaterSplashLaunchDroplets1} viewBox="0 0 54 48" />
              </div>
              <div className="absolute h-[60px] left-[86px] top-[86px] w-[70px]" data-name="Water splash — landing droplets">
                <AnimatedSvgAsset src={imgWaterSplashLandingDroplets1} viewBox="0 0 62 54" />
              </div>
              <div className="absolute h-[22px] left-[82px] top-[126px] w-[72px]" data-name="Landing ripple — expanding ring">
                <AnimatedSvgAsset src={imgLandingRippleExpandingRing1} viewBox="0 0 72 22" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[152px] items-center justify-center left-[192px] top-[102px] w-[190px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <div className="h-[152px] overflow-clip relative w-[190px]" data-name="Fish leap — opposite direction 3">
              <div className="absolute h-[28px] left-[16px] top-[112px] w-[44px]" data-name="Doodle fish 3 — jumping left">
                <AnimatedSvgAsset src={imgDoodleFish3JumpingLeft} viewBox="0 0 42 32" />
              </div>
              <div className="absolute h-[52px] left-[5px] top-[92px] w-[58px]" data-name="Water splash — launch droplets">
                <AnimatedSvgAsset src={imgWaterSplashLaunchDroplets2} viewBox="0 0 54 48" />
              </div>
              <div className="absolute h-[60px] left-[86px] top-[86px] w-[70px]" data-name="Water splash — landing droplets">
                <AnimatedSvgAsset src={imgWaterSplashLandingDroplets2} viewBox="0 0 62 54" />
              </div>
              <div className="absolute h-[22px] left-[82px] top-[126px] w-[72px]" data-name="Landing ripple — expanding ring">
                <AnimatedSvgAsset src={imgLandingRippleExpandingRing2} viewBox="0 0 72 22" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute h-[122px] left-[-174.2px] top-[179px] w-[650px]" data-name="Doodle waves — foreground ribbon">
          <div className="absolute inset-[0_-20%_0_-0.15%]">
            <img alt="" className="block max-w-none size-full" src={imgDoodleWavesForegroundRibbon} />
          </div>
        </div>
        <div className="absolute h-[232px] left-0 top-0 w-[390px]" data-name="Pencil ripple accents">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPencilRippleAccents} />
        </div>
        <div className="absolute h-[232px] left-0 top-0 w-[390px]" data-name="Paper boats — three sailing lanes">
          <div className="absolute h-[33.6px] left-[62.4px] top-[108.77px] w-[48px]" data-name="Paper boat 1 — sailing">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPaperBoat1Sailing} />
          </div>
          <div className="absolute h-[29.4px] left-[191.1px] top-[133.42px] w-[42px]" data-name="Paper boat 2 — sailing">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPaperBoat2Sailing} />
          </div>
          <div className="absolute h-[26.6px] left-[312px] top-[178.86px] w-[38px]" data-name="Paper boat 3 — sailing">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPaperBoat3Sailing} />
          </div>
        </div>
      </div>
    </div>
  );
}
