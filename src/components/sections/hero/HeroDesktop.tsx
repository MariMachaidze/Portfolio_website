import { profile } from "../../../data/profile";
import { AvatarPlaceholder } from "../../placeholders/AvatarPlaceholder";
import AnimatedSvgAsset from "./AnimatedSvgAsset";
import { HeroSocialLinks } from "./HeroSocialLinks";

const p = "/assets/desktop";
const imgStatus = `${p}/e72c6.svg`;
const imgGitHubDoodleLink = `${p}/9c043.svg`;
const imgLinkedInDoodleLink = `${p}/b45f0.svg`;
const imgXDoodleLink = `${p}/63ea1.svg`;
const imgMail = `${p}/d533e.svg`;
const imgHandSketchedLinkFrame = `${p}/d8b10.svg`;
const imgDoodleSparkle = `${p}/1cd45.svg`;
const imgDoodleStar = `${p}/d142e.svg`;
const imgBotanicalHeadshotWreathPencilRingAndLeafyStems = `${p}/4481b.svg`;
const imgLeafSprigsAroundThePortrait = `${p}/0b466.svg`;
const imgRoseHandDrawnPetals = `${p}/29d55.svg`;
const imgFlowerDaisy2 = `${p}/adcb5.svg`;
const imgGoldenFlowerHeart2 = `${p}/d29c6.svg`;
const imgPoppyHandDrawnPetals = `${p}/4d3f1.svg`;
const imgForgetMeNotHandDrawnPetals = `${p}/f3a32.svg`;
const imgTulipHandDrawnPetals = `${p}/a1895.svg`;
const imgRoseHandDrawnPetals1 = `${p}/c0092.svg`;
const imgForgetMeNotHandDrawnPetals1 = `${p}/d7bf0.svg`;
const imgPoppyHandDrawnPetals1 = `${p}/84838.svg`;
const imgRoseHandDrawnPetals2 = `${p}/a5b37.svg`;
const imgTulipHandDrawnPetals1 = `${p}/21ee9.svg`;
const imgFlowerDaisy11 = `${p}/8ca1e.svg`;
const imgGoldenFlowerHeart11 = `${p}/c2326.svg`;
const imgSunshineSoftHalo = `${p}/d33a4.svg`;
const imgSunshineLongSketchRays = `${p}/d8cbf.svg`;
const imgSunshineTwinklingRays = `${p}/d114d.svg`;
const imgSmilingPencilSun = `${p}/63133.svg`;
const imgMountainRidgeClearPeaksAndPencilFacets = `${p}/1776b.svg`;
const imgWoodedHillsContinuousShoreline = `${p}/9b743.svg`;
const imgPineTree1Static = `${p}/af585.svg`;
const imgPineTree2Static = `${p}/68b4f.svg`;
const imgPineTree3Static = `${p}/2222c.svg`;
const imgPineTree4Static = `${p}/83a63.svg`;
const imgPineTree5Static = `${p}/e83a0.svg`;
const imgPineTree6Static = `${p}/9b9ff.svg`;
const imgPineTree7Static = `${p}/df1da.svg`;
const imgPineTree8Static = `${p}/f36ed.svg`;
const imgPineTree9Static = `${p}/b49d0.svg`;
const imgPineTree10Static = `${p}/f415d.svg`;
const imgPineTree11Static = `${p}/656f7.svg`;
const imgPineTree12Static = `${p}/0ecfd.svg`;
const imgVisibleWindTrail1 = `${p}/53b15.svg`;
const imgVisibleWindTrail2 = `${p}/ab9d8.svg`;
const imgVisibleWindTrail3 = `${p}/3ab26.svg`;
const imgDoodleWavesFarRibbon = `${p}/2f3c4.svg`;
const imgDoodleWavesWanderingWater = `${p}/f20dd.svg`;
const imgDoodleFishJumpingOutAndDivingUnder = `${p}/14539.svg`;
const imgWaterSplashLaunchDroplets = `${p}/3b39c.svg`;
const imgWaterSplashLandingDroplets = `${p}/faa2a.svg`;
const imgLandingRippleExpandingRing = `${p}/55fda.svg`;
const imgDoodleFish2JumpingLeft = `${p}/2d3ac.svg`;
const imgWaterSplashLaunchDroplets1 = `${p}/36dab.svg`;
const imgWaterSplashLandingDroplets1 = `${p}/47814.svg`;
const imgLandingRippleExpandingRing1 = `${p}/82f6c.svg`;
const imgDoodleFish3JumpingLeft = `${p}/62902.svg`;
const imgWaterSplashLaunchDroplets2 = `${p}/0e63b.svg`;
const imgWaterSplashLandingDroplets2 = `${p}/ad658.svg`;
const imgLandingRippleExpandingRing2 = `${p}/18813.svg`;
const imgDoodleWavesForegroundRibbon = `${p}/0e34e.svg`;
const imgPencilRippleAccents = `${p}/34a35.svg`;
const imgPaperBoat1Sailing = `${p}/5671d.svg`;
const imgPaperBoat2Sailing = `${p}/6abb8.svg`;
const imgPaperBoat3Sailing = `${p}/62e22.svg`;

export function HeroDesktop() {
  return (
    <div
      className="bg-[#0b1f3a] content-stretch flex flex-col gap-[48px] items-start justify-center overflow-clip pb-[296px] pt-[112px] px-[168px] relative shrink-0 w-full"
      data-name="Introduction"
    >
      <div className="content-stretch flex gap-[48px] items-center relative shrink-0 w-full" data-name="Content">
        <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-[633.6px]" data-name="Biography">
          {profile.showBadge && profile.badge && (
            <div
              className="bg-[#13203a] border border-[#1e3a5f] border-solid content-stretch flex gap-[8px] items-center overflow-clip px-[12px] py-[4px] relative rounded-[999px] shrink-0"
              data-name="Availability"
            >
              <div className="relative shrink-0 size-[8px]" data-name="Status">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStatus} />
              </div>
              <p className="[word-break:break-word] font-body font-semibold leading-[20px] relative shrink-0 text-[#f5e6d3] text-[14px] whitespace-nowrap">
                {profile.badge}
              </p>
            </div>
          )}
          <div className="content-stretch flex flex-col items-start overflow-clip pt-[24px] relative shrink-0 w-full" data-name="Greeting">
            <p
              className="[word-break:break-word] font-heading font-semibold leading-[55.44px] relative shrink-0 text-[#f5e6d3] text-[44.352px] w-full"
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
            <p className="[word-break:break-word] font-body font-normal leading-[24px] relative shrink-0 text-[#d7e3f0] text-[16px] w-[576px]">
              {profile.blurb}
            </p>
          </div>
          <div className="content-stretch flex items-start pt-[32px] relative shrink-0" data-name="Social profiles">
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
        <div className="content-stretch flex flex-[1_0_0] flex-col h-[338px] items-center min-w-px relative" data-name="Portrait area">
          <div className="content-stretch flex flex-col items-start relative rounded-[140px] shrink-0 size-[280px]" data-name="Doodle frame">
            <div className="absolute left-[24px] size-[232px] top-[24px] rounded-full overflow-hidden" data-name="Portrait of Mariam Machaidze">
              {profile.avatarUrl ? (
                <img alt={profile.avatarAlt} className="block size-full object-cover" src={profile.avatarUrl} />
              ) : (
                <AvatarPlaceholder name={profile.name} className="size-full" />
              )}
            </div>
            <div className="absolute left-[-13px] size-[20px] top-[40px]" data-name="Doodle sparkle">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDoodleSparkle} />
            </div>
            <div className="absolute left-[282px] size-[13px] top-[159.6px]" data-name="Doodle star">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDoodleStar} />
            </div>
            <div className="absolute left-0 size-[280px] top-0" data-name="Botanical headshot wreath — pencil ring and leafy stems">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBotanicalHeadshotWreathPencilRingAndLeafyStems} />
            </div>
            <div className="absolute left-0 size-[280px] top-0" data-name="Leaf sprigs around the portrait">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLeafSprigsAroundThePortrait} />
            </div>
            <div className="absolute left-[12.12px] size-[42px] top-[44.16px]" data-name="Flower — Rose 1">
              <div className="absolute left-0 size-[42px] top-0" data-name="Rose — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRoseHandDrawnPetals} />
              </div>
            </div>
            <div className="absolute left-[164.15px] size-[32.34px] top-[-0.26px]" data-name="Flower — Daisy 2">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFlowerDaisy2} />
            </div>
            <div className="absolute left-[164.15px] size-[32.34px] top-[-0.26px]" data-name="Golden flower heart 2">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGoldenFlowerHeart2} />
            </div>
            <div className="absolute left-[229.65px] size-[42px] top-[188.14px]" data-name="Flower — Poppy 3">
              <div className="absolute left-0 size-[42px] top-0" data-name="Poppy — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPoppyHandDrawnPetals} />
              </div>
            </div>
            <div className="absolute left-[169.93px] size-[29.4px] top-[247.91px]" data-name="Flower — Forget-me-not 4">
              <div className="absolute left-0 size-[29.4px] top-0" data-name="Forget-me-not — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgForgetMeNotHandDrawnPetals} />
              </div>
            </div>
            <div className="absolute left-[-8.3px] size-[36px] top-[115.17px]" data-name="Flower — Tulip 5">
              <div className="absolute left-0 size-[36px] top-0" data-name="Tulip — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgTulipHandDrawnPetals} />
              </div>
            </div>
            <div className="absolute left-[60.76px] size-[28px] top-[13px]" data-name="Flower — Rose 6">
              <div className="absolute left-0 size-[28px] top-0" data-name="Rose — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRoseHandDrawnPetals1} />
              </div>
            </div>
            <div className="absolute left-[222.95px] size-[34px] top-[39.13px]" data-name="Flower — Forget-me-not 7">
              <div className="absolute left-0 size-[34px] top-0" data-name="Forget-me-not — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgForgetMeNotHandDrawnPetals1} />
              </div>
            </div>
            <div className="absolute left-[254.98px] size-[30px] top-[113.63px]" data-name="Flower — Poppy 8">
              <div className="absolute left-0 size-[30px] top-0" data-name="Poppy — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPoppyHandDrawnPetals1} />
              </div>
            </div>
            <div className="absolute left-[202.52px] size-[32px] top-[228.21px]" data-name="Flower — Rose 9">
              <div className="absolute left-0 size-[32px] top-0" data-name="Rose — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRoseHandDrawnPetals2} />
              </div>
            </div>
            <div className="absolute left-[65.74px] size-[26px] top-[242.21px]" data-name="Flower — Tulip 10">
              <div className="absolute left-0 size-[26px] top-0" data-name="Tulip — hand-drawn petals">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgTulipHandDrawnPetals1} />
              </div>
            </div>
            <div className="absolute left-[8.73px] size-[28px] top-[183.2px]" data-name="Flower — Daisy 11">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFlowerDaisy11} />
            </div>
            <div className="absolute left-[8.73px] size-[28px] top-[183.2px]" data-name="Golden flower heart 11">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGoldenFlowerHeart11} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[263px] left-0 overflow-clip top-[483px] w-[1440px]" data-name="Doodle landscape — hills, waves and sunshine">
        <div className="absolute left-[801.6px] size-[96px] top-px" data-name="Shining doodle sun">
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
        <div className="absolute h-[263px] left-0 top-0 w-[1440px]" data-name="Mountain ridge — clear peaks and pencil facets">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMountainRidgeClearPeaksAndPencilFacets} />
        </div>
        <div className="absolute h-[263px] left-0 top-0 w-[1440px]" data-name="Wooded hills — continuous shoreline">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgWoodedHillsContinuousShoreline} />
        </div>
        <div className="absolute h-[263px] left-0 overflow-clip top-0 w-[1440px]" data-name="Pencil pine trees along the hills">
          <div className="absolute inset-[30.42%_96.09%_49.81%_2.09%]">
            <div className="absolute inset-[-1.06%_-2.09%_-0.87%_-2.09%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree1Static} />
            </div>
          </div>
          <div className="absolute inset-[32.32%_92.82%_52.47%_5.82%]">
            <div className="absolute inset-[-1.38%_-2.81%_-1.12%_-2.81%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree2Static} />
            </div>
          </div>
          <div className="absolute inset-[23.95%_89.03%_55.13%_9.03%]">
            <div className="absolute inset-[-1%_-1.96%_-0.82%_-1.96%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree3Static} />
            </div>
          </div>
          <div className="absolute inset-[25.1%_84.7%_57.41%_13.7%]">
            <div className="absolute inset-[-1.2%_-2.4%_-0.98%_-2.4%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree4Static} />
            </div>
          </div>
          <div className="absolute inset-[27%_79.38%_58.94%_19.38%]">
            <div className="absolute inset-[-1.49%_-3.07%_-1.22%_-3.07%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree5Static} />
            </div>
          </div>
          <div className="absolute inset-[22.81%_74.11%_57.79%_24.11%]">
            <div className="absolute inset-[-1.08%_-2.14%_-0.88%_-2.14%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree6Static} />
            </div>
          </div>
          <div className="absolute inset-[33.08%_67.46%_54.37%_31.46%]">
            <div className="absolute inset-[-1.67%_-3.51%_-1.36%_-3.51%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree7Static} />
            </div>
          </div>
          <div className="absolute inset-[23.19%_25.14%_58.17%_73.14%]">
            <div className="absolute inset-[-1.12%_-2.23%_-0.92%_-2.23%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree8Static} />
            </div>
          </div>
          <div className="absolute inset-[28.14%_21.32%_56.65%_77.32%]">
            <div className="absolute inset-[-1.38%_-2.81%_-1.12%_-2.81%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree9Static} />
            </div>
          </div>
          <div className="absolute inset-[25.48%_10.03%_53.61%_88.03%]">
            <div className="absolute inset-[-1%_-1.96%_-0.82%_-1.96%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree10Static} />
            </div>
          </div>
          <div className="absolute inset-[28.52%_5.32%_56.27%_93.32%]">
            <div className="absolute inset-[-1.38%_-2.81%_-1.12%_-2.81%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree11Static} />
            </div>
          </div>
          <div className="absolute inset-[22.05%_1.12%_58.94%_97.13%]">
            <div className="absolute inset-[-1.1%_-2.18%_-0.9%_-2.18%]">
              <img alt="" className="block max-w-none size-full" src={imgPineTree12Static} />
            </div>
          </div>
        </div>
        <div className="absolute h-[32px] left-[36px] top-[65px] w-[130px]" data-name="Visible wind trail 1">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVisibleWindTrail1} />
        </div>
        <div className="absolute h-[32px] left-[1036.8px] top-[61px] w-[130px]" data-name="Visible wind trail 2">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVisibleWindTrail2} />
        </div>
        <div className="absolute h-[32px] left-[532.8px] top-[118px] w-[130px]" data-name="Visible wind trail 3">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVisibleWindTrail3} />
        </div>
        <div className="absolute h-[122px] left-[-200px] top-[141px] w-[1840px]" data-name="Doodle waves — far ribbon">
          <div className="absolute inset-[0_-10.87%_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgDoodleWavesFarRibbon} />
          </div>
        </div>
        <div className="absolute h-[122px] left-[-234px] top-[168px] w-[1840px]" data-name="Doodle waves — wandering water">
          <div className="absolute inset-[0_-10.87%_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgDoodleWavesWanderingWater} />
          </div>
        </div>
        <div className="absolute h-[152px] left-[619.2px] overflow-clip top-[117px] w-[190px]" data-name="Fish leap — waterline stage">
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
        <div className="absolute flex h-[152px] items-center justify-center left-[57.6px] top-[123px] w-[190px]">
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
        <div className="absolute flex h-[152px] items-center justify-center left-[1022.4px] top-[133px] w-[190px]">
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
        <div className="absolute h-[122px] left-[-268px] top-[210px] w-[1840px]" data-name="Doodle waves — foreground ribbon">
          <div className="absolute inset-[0_-10.87%_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgDoodleWavesForegroundRibbon} />
          </div>
        </div>
        <div className="absolute h-[232px] left-0 top-[31px] w-[1440px]" data-name="Pencil ripple accents">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPencilRippleAccents} />
        </div>
        <div className="absolute h-[263px] left-0 top-0 w-[1440px]" data-name="Paper boats — three sailing lanes">
          <div className="absolute h-[50.4px] left-[230.4px] top-[125.15px] w-[72px]" data-name="Paper boat 1 — sailing">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPaperBoat1Sailing} />
          </div>
          <div className="absolute h-[42px] left-[705.6px] top-[153.46px] w-[60px]" data-name="Paper boat 2 — sailing">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPaperBoat2Sailing} />
          </div>
          <div className="absolute h-[37.8px] left-[1152px] top-[200.11px] w-[54px]" data-name="Paper boat 3 — sailing">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPaperBoat3Sailing} />
          </div>
        </div>
      </div>
    </div>
  );
}
