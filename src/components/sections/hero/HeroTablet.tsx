import { profile } from "../../../data/profile";
import { AvatarPlaceholder } from "../../placeholders/AvatarPlaceholder";
import AnimatedSvgAsset from "./AnimatedSvgAsset";
import { HeroSocialLinks } from "./HeroSocialLinks";

const p = "/assets/tablet";
const imgStatus = `${p}/b7217.svg`;
const imgGitHubDoodleLink = `${p}/99286.svg`;
const imgLinkedInDoodleLink = `${p}/d11a2.svg`;
const imgXDoodleLink = `${p}/d98a0.svg`;
const imgMail = `${p}/1faca.svg`;
const imgHandSketchedLinkFrame = `${p}/6f51a.svg`;
const imgDoodleSparkle = `${p}/766de.svg`;
const imgDoodleStar = `${p}/0fb5b.svg`;
const imgBotanicalHeadshotWreathPencilRingAndLeafyStems = `${p}/37eaf.svg`;
const imgLeafSprigsAroundThePortrait = `${p}/ae222.svg`;
const imgRoseHandDrawnPetals = `${p}/29d55.svg`;
const imgFlowerDaisy2 = `${p}/e3d9f.svg`;
const imgGoldenFlowerHeart2 = `${p}/5c3e1.svg`;
const imgPoppyHandDrawnPetals = `${p}/4d3f1.svg`;
const imgForgetMeNotHandDrawnPetals = `${p}/f3a32.svg`;
const imgTulipHandDrawnPetals = `${p}/a1895.svg`;
const imgRoseHandDrawnPetals1 = `${p}/c0092.svg`;
const imgForgetMeNotHandDrawnPetals1 = `${p}/d7bf0.svg`;
const imgPoppyHandDrawnPetals1 = `${p}/84838.svg`;
const imgRoseHandDrawnPetals2 = `${p}/a5b37.svg`;
const imgTulipHandDrawnPetals1 = `${p}/21ee9.svg`;
const imgFlowerDaisy11 = `${p}/6b885.svg`;
const imgGoldenFlowerHeart11 = `${p}/d89df.svg`;
const imgSunshineSoftHalo = `${p}/55474.svg`;
const imgSunshineLongSketchRays = `${p}/3a918.svg`;
const imgSunshineTwinklingRays = `${p}/e50e2.svg`;
const imgSmilingPencilSun = `${p}/63133.svg`;
const imgMountainRidgeClearPeaksAndPencilFacets = `${p}/9625a.svg`;
const imgWoodedHillsContinuousShoreline = `${p}/95df6.svg`;
const imgPineTree1Static = `${p}/3a12d.svg`;
const imgPineTree2Static = `${p}/34e44.svg`;
const imgPineTree3Static = `${p}/aa956.svg`;
const imgPineTree4Static = `${p}/9d7d2.svg`;
const imgPineTree5Static = `${p}/354fb.svg`;
const imgPineTree6Static = `${p}/2bc31.svg`;
const imgPineTree7Static = `${p}/62999.svg`;
const imgPineTree8Static = `${p}/2e5f3.svg`;
const imgVisibleWindTrail1 = `${p}/3a32c.svg`;
const imgVisibleWindTrail2 = `${p}/7fc6e.svg`;
const imgVisibleWindTrail3 = `${p}/b8ff6.svg`;
const imgDoodleWavesFarRibbon = `${p}/ee7c2.svg`;
const imgDoodleWavesWanderingWater = `${p}/1ee2b.svg`;
const imgDoodleFishJumpingOutAndDivingUnder = `${p}/e0aa1.svg`;
const imgWaterSplashLaunchDroplets = `${p}/8384e.svg`;
const imgWaterSplashLandingDroplets = `${p}/54c4a.svg`;
const imgLandingRippleExpandingRing = `${p}/6aa05.svg`;
const imgDoodleFish2JumpingLeft = `${p}/8620a.svg`;
const imgWaterSplashLaunchDroplets1 = `${p}/a1447.svg`;
const imgWaterSplashLandingDroplets1 = `${p}/4d295.svg`;
const imgLandingRippleExpandingRing1 = `${p}/37b0c.svg`;
const imgDoodleFish3JumpingLeft = `${p}/fddd0.svg`;
const imgWaterSplashLaunchDroplets2 = `${p}/10fb1.svg`;
const imgWaterSplashLandingDroplets2 = `${p}/9f793.svg`;
const imgLandingRippleExpandingRing2 = `${p}/18c93.svg`;
const imgDoodleWavesForegroundRibbon = `${p}/826c9.svg`;
const imgPencilRippleAccents = `${p}/acc7f.svg`;
const imgPaperBoat1Sailing = `${p}/ce292.svg`;
const imgPaperBoat2Sailing = `${p}/a8d40.svg`;
const imgPaperBoat3Sailing = `${p}/1c128.svg`;

export function HeroTablet() {
  return (
    <div
      className="bg-[#0b1f3a] content-stretch flex gap-[48px] items-center overflow-clip pb-[284px] pt-[96px] px-[24px] relative shrink-0 w-full"
      data-name="Introduction"
    >
      <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-[403.2px]" data-name="Biography">
        {profile.showBadge && profile.badge && (
          <div
            className="bg-[#13243b] border border-[#1e3a5f] border-solid content-stretch flex gap-[8px] items-center overflow-clip px-[12px] py-[4px] relative rounded-[999px] shrink-0"
            data-name="Availability"
          >
            <div className="relative shrink-0 size-[8px]" data-name="Status">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStatus} />
            </div>
            <p className="[word-break:break-word] font-body font-semibold leading-[20px] relative shrink-0 text-[#d7e3f0] text-[14px] whitespace-nowrap">
              {profile.badge}
            </p>
          </div>
        )}
        <div className="content-stretch flex flex-col items-start overflow-clip pt-[24px] relative shrink-0 w-full" data-name="Greeting">
          <p
            className="[word-break:break-word] font-heading font-semibold leading-[35.28px] relative shrink-0 text-[#f4f1e8] text-[28.224px] w-full"
            style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
          >{`Hello, I'm ${profile.name}`}</p>
        </div>
        <div className="content-stretch flex flex-col items-start overflow-clip pt-[12px] relative shrink-0 w-full" data-name="Role">
          <p className="[word-break:break-word] font-body font-normal leading-[28px] relative shrink-0 text-[#d7e3f0] text-[18px] w-full whitespace-pre-wrap">
            {profile.role}
            {profile.showYearsExperience && profile.yearsExperience ? ` · ${profile.yearsExperience}+ years of experience` : ""}
          </p>
        </div>
        <div className="content-stretch flex flex-col items-start overflow-clip pt-[20px] relative shrink-0 w-full" data-name="Summary">
          <p className="[word-break:break-word] font-body font-normal leading-[24px] relative shrink-0 text-[#d7e3f0] text-[16px] w-[403.2px]">
            {profile.blurb}
          </p>
        </div>
        <div className="content-stretch flex flex-col items-start overflow-clip pt-[32px] relative shrink-0" data-name="Social profiles">
          <HeroSocialLinks
            gap={16}
            iconSize={40}
            githubSrc={imgGitHubDoodleLink}
            linkedinSrc={imgLinkedInDoodleLink}
            xSrc={imgXDoodleLink}
            mailSrc={imgMail}
            frameSrc={imgHandSketchedLinkFrame}
          />
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-w-px relative" data-name="Portrait area">
        <div className="relative shrink-0 size-[264px]" data-name="Doodle portrait frame">
          <div className="absolute left-[16px] size-[232px] top-[16px] rounded-full overflow-hidden" data-name="Portrait of Mariam Machaidze">
            {profile.avatarUrl ? (
              <img alt={profile.avatarAlt} className="block size-full object-cover" src={profile.avatarUrl} />
            ) : (
              <AvatarPlaceholder name={profile.name} className="size-full" />
            )}
          </div>
          <div className="absolute left-[-13px] size-[20px] top-[40px]" data-name="Doodle sparkle">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDoodleSparkle} />
          </div>
          <div className="absolute left-[266px] size-[13px] top-[150.48px]" data-name="Doodle star">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDoodleStar} />
          </div>
          <div className="absolute left-0 size-[264px] top-0" data-name="Botanical headshot wreath — pencil ring and leafy stems">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBotanicalHeadshotWreathPencilRingAndLeafyStems} />
          </div>
          <div className="absolute left-0 size-[264px] top-0" data-name="Leaf sprigs around the portrait">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLeafSprigsAroundThePortrait} />
          </div>
          <div className="absolute left-[10.22px] size-[42px] top-[40.44px]" data-name="Flower — Rose 1">
            <div className="absolute left-0 size-[42px] top-0" data-name="Rose — hand-drawn petals">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRoseHandDrawnPetals} />
            </div>
          </div>
          <div className="absolute left-[153.85px] size-[32.34px] top-[-1.17px]" data-name="Flower — Daisy 2">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFlowerDaisy2} />
          </div>
          <div className="absolute left-[153.85px] size-[32.34px] top-[-1.17px]" data-name="Golden flower heart 2">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGoldenFlowerHeart2} />
          </div>
          <div className="absolute left-[215.33px] size-[42px] top-[176.19px]" data-name="Flower — Poppy 3">
            <div className="absolute left-0 size-[42px] top-0" data-name="Poppy — hand-drawn petals">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPoppyHandDrawnPetals} />
            </div>
          </div>
          <div className="absolute left-[159.38px] size-[29.4px] top-[232.9px]" data-name="Flower — Forget-me-not 4">
            <div className="absolute left-0 size-[29.4px] top-0" data-name="Forget-me-not — hand-drawn petals">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgForgetMeNotHandDrawnPetals} />
            </div>
          </div>
          <div className="absolute left-[-8.86px] size-[36px] top-[107.56px]" data-name="Flower — Tulip 5">
            <div className="absolute left-0 size-[36px] top-0" data-name="Tulip — hand-drawn petals">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgTulipHandDrawnPetals} />
            </div>
          </div>
          <div className="absolute left-[56.49px] size-[28px] top-[11.46px]" data-name="Flower — Rose 6">
            <div className="absolute left-0 size-[28px] top-0" data-name="Rose — hand-drawn petals">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRoseHandDrawnPetals1} />
            </div>
          </div>
          <div className="absolute left-[209.24px] size-[34px] top-[35.92px]" data-name="Flower — Forget-me-not 7">
            <div className="absolute left-0 size-[34px] top-0" data-name="Forget-me-not — hand-drawn petals">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgForgetMeNotHandDrawnPetals1} />
            </div>
          </div>
          <div className="absolute left-[239.56px] size-[30px] top-[106.28px]" data-name="Flower — Poppy 8">
            <div className="absolute left-0 size-[30px] top-0" data-name="Poppy — hand-drawn petals">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPoppyHandDrawnPetals1} />
            </div>
          </div>
          <div className="absolute left-[190.04px] size-[32px] top-[214.25px]" data-name="Flower — Rose 9">
            <div className="absolute left-0 size-[32px] top-0" data-name="Rose — hand-drawn petals">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRoseHandDrawnPetals2} />
            </div>
          </div>
          <div className="absolute left-[61.24px] size-[26px] top-[227.62px]" data-name="Flower — Tulip 10">
            <div className="absolute left-0 size-[26px] top-0" data-name="Tulip — hand-drawn petals">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgTulipHandDrawnPetals1} />
            </div>
          </div>
          <div className="absolute left-[7.43px] size-[28px] top-[171.93px]" data-name="Flower — Daisy 11">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFlowerDaisy11} />
          </div>
          <div className="absolute left-[7.43px] size-[28px] top-[171.93px]" data-name="Golden flower heart 11">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGoldenFlowerHeart11} />
          </div>
        </div>
      </div>
      <div className="absolute h-[232px] left-0 overflow-clip top-[512px] w-[768px]" data-name="Doodle landscape — hills, waves and sunshine">
        <div className="absolute left-[405.12px] size-[96px] top-px" data-name="Shining doodle sun">
          <div className="absolute left-0 size-[96px] top-0" data-name="Sunshine — soft halo">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSunshineSoftHalo} />
          </div>
          <div className="absolute left-0 size-[96px] top-0" data-name="Sunshine — long sketch rays">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSunshineLongSketchRays} />
          </div>
          <div className="absolute left-0 size-[96px] top-0" data-name="Sunshine — twinkling rays">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSunshineTwinklingRays} />
          </div>
          <div className="absolute left-0 size-[96px] top-0" data-name="Smiling pencil sun">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSmilingPencilSun} />
          </div>
        </div>
        <div className="absolute h-[232px] left-0 top-0 w-[768px]" data-name="Mountain ridge — clear peaks and pencil facets">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMountainRidgeClearPeaksAndPencilFacets} />
        </div>
        <div className="absolute h-[232px] left-0 top-0 w-[768px]" data-name="Wooded hills — continuous shoreline">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgWoodedHillsContinuousShoreline} />
        </div>
        <div className="absolute h-[232px] left-0 overflow-clip top-0 w-[768px]" data-name="Pencil pine trees along the hills">
          <div className="absolute inset-[36.21%_93.97%_43.53%_2.97%]">
            <div className="absolute inset-[-1.17%_-2.34%_-0.96%_-2.34%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree1Static} />
            </div>
          </div>
          <div className="absolute inset-[35.78%_89.76%_47.41%_7.76%]">
            <div className="absolute inset-[-1.41%_-2.89%_-1.15%_-2.89%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree2Static} />
            </div>
          </div>
          <div className="absolute inset-[27.59%_83.36%_50.86%_13.36%]">
            <div className="absolute inset-[-1.1%_-2.18%_-0.9%_-2.18%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree3Static} />
            </div>
          </div>
          <div className="absolute inset-[32.76%_76.98%_53.02%_20.98%]">
            <div className="absolute inset-[-1.67%_-3.51%_-1.36%_-3.51%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree4Static} />
            </div>
          </div>
          <div className="absolute inset-[37.07%_66.83%_46.98%_30.83%]">
            <div className="absolute inset-[-1.49%_-3.07%_-1.22%_-3.07%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree5Static} />
            </div>
          </div>
          <div className="absolute inset-[25.86%_24.47%_53.88%_72.47%]">
            <div className="absolute inset-[-1.17%_-2.34%_-0.96%_-2.34%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree6Static} />
            </div>
          </div>
          <div className="absolute inset-[34.05%_19.87%_50.43%_77.87%]">
            <div className="absolute inset-[-1.53%_-3.17%_-1.25%_-3.17%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree7Static} />
            </div>
          </div>
          <div className="absolute inset-[31.03%_8.4%_47.84%_88.4%]">
            <div className="absolute inset-[-1.12%_-2.23%_-0.92%_-2.23%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree8Static} />
            </div>
          </div>
        </div>
        <div className="absolute h-[32px] left-[19.2px] top-[65px] w-[130px]" data-name="Visible wind trail 1">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVisibleWindTrail1} />
        </div>
        <div className="absolute h-[32px] left-[552.96px] top-[61px] w-[130px]" data-name="Visible wind trail 2">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVisibleWindTrail2} />
        </div>
        <div className="absolute h-[32px] left-[284.16px] top-[118px] w-[130px]" data-name="Visible wind trail 3">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVisibleWindTrail3} />
        </div>
        <div className="absolute h-[122px] left-[-168px] top-[110px] w-[1104px]" data-name="Doodle waves — far ribbon">
          <div className="absolute inset-[0_-15.22%_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgDoodleWavesFarRibbon} />
          </div>
        </div>
        <div className="absolute h-[122px] left-[-196.56px] top-[137px] w-[1104px]" data-name="Doodle waves — wandering water">
          <div className="absolute inset-[0_-15.22%_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgDoodleWavesWanderingWater} />
          </div>
        </div>
        <div className="absolute h-[152px] left-[330.24px] overflow-clip top-[86px] w-[190px]" data-name="Fish leap — waterline stage">
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
        <div className="absolute flex h-[152px] items-center justify-center left-[30.72px] top-[92px] w-[190px]">
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
        <div className="absolute flex h-[152px] items-center justify-center left-[545.28px] top-[102px] w-[190px]">
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
        <div className="absolute h-[122px] left-[-225.12px] top-[179px] w-[1104px]" data-name="Doodle waves — foreground ribbon">
          <div className="absolute inset-[0_-15.22%_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgDoodleWavesForegroundRibbon} />
          </div>
        </div>
        <div className="absolute h-[232px] left-0 top-0 w-[768px]" data-name="Pencil ripple accents">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPencilRippleAccents} />
        </div>
        <div className="absolute h-[232px] left-0 top-0 w-[768px]" data-name="Paper boats — three sailing lanes">
          <div className="absolute h-[44.8px] left-[122.88px] top-[99.02px] w-[64px]" data-name="Paper boat 1 — sailing">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPaperBoat1Sailing} />
          </div>
          <div className="absolute h-[37.8px] left-[376.32px] top-[126.11px] w-[54px]" data-name="Paper boat 2 — sailing">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPaperBoat2Sailing} />
          </div>
          <div className="absolute h-[33.6px] left-[614.4px] top-[172.77px] w-[48px]" data-name="Paper boat 3 — sailing">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPaperBoat3Sailing} />
          </div>
        </div>
      </div>
    </div>
  );
}
