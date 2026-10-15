import type { StaticImageData } from "next/image";
import type { CreativeCategory, CreativeImage, CreativeVideo } from "@/types/content";
import beveragesIceCreamPost from "@/assets/portfolio/creative/social-media/beverages-ice-cream.webp";
import healthCarePost from "@/assets/portfolio/creative/social-media/health-care.webp";
import fragrancePost from "@/assets/portfolio/creative/social-media/fragrance.webp";
import realEstatePost from "@/assets/portfolio/creative/social-media/real-estate.webp";
import snacksPost from "@/assets/portfolio/creative/social-media/snacks.webp";
import engineOilNightPost from "@/assets/portfolio/creative/social-media/engine-oil-night.webp";
import engineOilGoldPost from "@/assets/portfolio/creative/social-media/engine-oil-gold.webp";
import engineCarePost from "@/assets/portfolio/creative/social-media/engine-care.webp";
import lubricantsPost from "@/assets/portfolio/creative/social-media/lubricants.webp";
import autoPartsPost from "@/assets/portfolio/creative/social-media/auto-parts.webp";
import autoPartsEngagementPost from "@/assets/portfolio/creative/social-media/auto-parts-engagement.webp";
import chilledCoffeeSplashShot from "@/assets/portfolio/creative/ai-photoshoot/chilled-coffee-splash.webp";
import chilledCoffeeCloseUpShot from "@/assets/portfolio/creative/ai-photoshoot/chilled-coffee-close-up.webp";
import chilledCoffeePourShot from "@/assets/portfolio/creative/ai-photoshoot/chilled-coffee-pour.webp";
import chilledCoffeeSwirlShot from "@/assets/portfolio/creative/ai-photoshoot/chilled-coffee-swirl.webp";
import fragranceUnderwaterShot from "@/assets/portfolio/creative/ai-photoshoot/fragrance-underwater.webp";
import fragranceStormShot from "@/assets/portfolio/creative/ai-photoshoot/fragrance-storm.webp";
import fragranceLevitationShot from "@/assets/portfolio/creative/ai-photoshoot/fragrance-levitation.webp";
import fragrancePortraitShot from "@/assets/portfolio/creative/ai-photoshoot/fragrance-portrait.webp";
import aiVideoAd01Poster from "@/assets/portfolio/creative/posters/ai-video-ads/ai-video-ad-01.webp";
import aiVideoAd02Poster from "@/assets/portfolio/creative/posters/ai-video-ads/ai-video-ad-02.webp";
import aiVideoAd03Poster from "@/assets/portfolio/creative/posters/ai-video-ads/ai-video-ad-03.webp";
import aiVideoAd04Poster from "@/assets/portfolio/creative/posters/ai-video-ads/ai-video-ad-04.webp";
import aiVideoAd05Poster from "@/assets/portfolio/creative/posters/ai-video-ads/ai-video-ad-05.webp";
import aiVideoAd06Poster from "@/assets/portfolio/creative/posters/ai-video-ads/ai-video-ad-06.webp";
import aiVideoAd07Poster from "@/assets/portfolio/creative/posters/ai-video-ads/ai-video-ad-07.webp";
import aiVideoAd08Poster from "@/assets/portfolio/creative/posters/ai-video-ads/ai-video-ad-08.webp";
import aiVideoAd09Poster from "@/assets/portfolio/creative/posters/ai-video-ads/ai-video-ad-09.webp";
import logoAnimation01Poster from "@/assets/portfolio/creative/posters/logo-animations/logo-animation-01.webp";
import logoAnimation02Poster from "@/assets/portfolio/creative/posters/logo-animations/logo-animation-02.webp";
import logoAnimation03Poster from "@/assets/portfolio/creative/posters/logo-animations/logo-animation-03.webp";
import logoAnimation04Poster from "@/assets/portfolio/creative/posters/logo-animations/logo-animation-04.webp";
import logoAnimation05Poster from "@/assets/portfolio/creative/posters/logo-animations/logo-animation-05.webp";
import logoAnimation06Poster from "@/assets/portfolio/creative/posters/logo-animations/logo-animation-06.webp";
import logoAnimation07Poster from "@/assets/portfolio/creative/posters/logo-animations/logo-animation-07.webp";
import logoAnimation08Poster from "@/assets/portfolio/creative/posters/logo-animations/logo-animation-08.webp";
import logoAnimation09Poster from "@/assets/portfolio/creative/posters/logo-animations/logo-animation-09.webp";
import logoAnimation10Poster from "@/assets/portfolio/creative/posters/logo-animations/logo-animation-10.webp";
import videoAd01Poster from "@/assets/portfolio/creative/posters/video-ads/video-ad-01.webp";
import videoAd02Poster from "@/assets/portfolio/creative/posters/video-ads/video-ad-02.webp";
import videoAd03Poster from "@/assets/portfolio/creative/posters/video-ads/video-ad-03.webp";
import videoAd04Poster from "@/assets/portfolio/creative/posters/video-ads/video-ad-04.webp";
import videoAd05Poster from "@/assets/portfolio/creative/posters/video-ads/video-ad-05.webp";
import videoAd06Poster from "@/assets/portfolio/creative/posters/video-ads/video-ad-06.webp";
import videoAd07Poster from "@/assets/portfolio/creative/posters/video-ads/video-ad-07.webp";
import videoAd08Poster from "@/assets/portfolio/creative/posters/video-ads/video-ad-08.webp";
import videoAd09Poster from "@/assets/portfolio/creative/posters/video-ads/video-ad-09.webp";
import videoAd10Poster from "@/assets/portfolio/creative/posters/video-ads/video-ad-10.webp";
import videoAd11Poster from "@/assets/portfolio/creative/posters/video-ads/video-ad-11.webp";
import videoAd12Poster from "@/assets/portfolio/creative/posters/video-ads/video-ad-12.webp";
import videoAd13Poster from "@/assets/portfolio/creative/posters/video-ads/video-ad-13.webp";
import videoAd14Poster from "@/assets/portfolio/creative/posters/video-ads/video-ad-14.webp";
import videoAd15Poster from "@/assets/portfolio/creative/posters/video-ads/video-ad-15.webp";
import videoAd16Poster from "@/assets/portfolio/creative/posters/video-ads/video-ad-16.webp";

/**
 * Creative portfolio: social media design, AI product photography and video work.
 * Stills are resized WebP (next/image serves the responsive sizes); videos are web
 * encodes in /public/media (≤960px, H.264/AAC) with a poster frame chosen per video.
 * No client names or results are claimed for any piece (constitution II).
 */
function image(title: string, src: StaticImageData, alt: string): CreativeImage {
  return { kind: "image", title, image: { src, alt } };
}

function video(
  title: string,
  src: string,
  poster: StaticImageData,
  description: string,
  duration: string,
): CreativeVideo {
  return {
    kind: "video",
    title,
    src,
    poster: { src: poster, alt: `Video still: ${description}` },
    duration,
  };
}

export const creativeCategories: CreativeCategory[] = [
  {
    slug: "social-media-design",
    name: "Social media design",
    intro:
      "Feed designs and campaign posts for beverage, health care, fragrance, real estate, snack and automotive brands, planned as a set so each profile looks consistent.",
    aspect: "4/5",
    items: [
      image(
        "Beverage and ice cream campaign",
        beveragesIceCreamPost,
        "Nine-post feed for a drinks and ice cream brand: mango and chocolate ice cream cups, a strawberry shake and blue slush drinks.",
      ),
      image(
        "Health care product launch",
        healthCarePost,
        "Social media feed introducing syrups and supplements for women's wellness, kidney health and digestion, with product shots and lifestyle photos.",
      ),
      image(
        "Fragrance brand feed",
        fragrancePost,
        "Nine-post feed for a men's fragrance: the bottle shown with a model, in a forest, by a waterfall, on desert sand and among gold nuggets.",
      ),
      image(
        "Real estate developer feed",
        realEstatePost,
        "Real estate posts in gold and white: active projects in Lahore, plot investment messages and contact details.",
      ),
      image(
        "Snack brand campaign",
        snacksPost,
        "Six posts for a snack brand's flavoured chips, set around a cricket rivalry, a picnic, a supermarket aisle and a road trip.",
      ),
      image(
        "Engine oil night-drive feed",
        engineOilNightPost,
        "Dark, neon-lit feed for an engine oil brand with a rider, a performance car and product bottles at night.",
      ),
      image(
        "Premium engine oil feed",
        engineOilGoldPost,
        "Engine oil feed in gold and red with synthetic oil bottles, splashing golden oil and product specification posts.",
      ),
      image(
        "Engine care social series",
        engineCarePost,
        "Engine oil posts on engine protection, smoother drives and heat resistance, with engines, oil pours and a red sports car.",
      ),
      image(
        "Lubricants product feed",
        lubricantsPost,
        "Lubricant brand posts with engine oil bottles for cars and motorbikes, performance messages and availability in Canada.",
      ),
      image(
        "Auto parts product feed",
        autoPartsPost,
        "Auto parts feed showing a suspension bushing, a blow pipe, a radiator hose, a gearbox mounting and a CV joint boot.",
      ),
      image(
        "Auto parts engagement posts",
        autoPartsEngagementPost,
        "Auto parts posts built for engagement: a guess-the-part quiz, a coolant quiz, five signs a part needs replacing and myth versus reality.",
      ),
    ],
  },
  {
    slug: "ai-photoshoots",
    name: "AI product photoshoots",
    intro:
      "Studio-style product photography created with AI: splashes, lighting and settings that would normally need a full shoot, made for social posts and ads.",
    aspect: "4/5",
    concept: true,
    items: [
      image(
        "Chilled coffee: splash",
        chilledCoffeeSplashShot,
        "AI product photo of a chilled mocha bottle floating with chocolate pieces, coffee beans, ice and a coffee splash.",
      ),
      image(
        "Chilled coffee: condensation",
        chilledCoffeeCloseUpShot,
        "AI close-up of a chilled mocha bottle covered in condensation droplets.",
      ),
      image(
        "Chilled coffee: chocolate pour",
        chilledCoffeePourShot,
        "AI product photo of a chilled mocha bottle with chocolate pouring in, surrounded by floating chocolate balls, beans and ice.",
      ),
      image(
        "Chilled coffee: chocolate swirl",
        chilledCoffeeSwirlShot,
        "AI product photo of a chilled mocha bottle in a swirl of melted chocolate with ice cubes and coffee beans.",
      ),
      image(
        "Fragrance: underwater",
        fragranceUnderwaterShot,
        "AI product photo of a violet perfume bottle held underwater, with light rippling across the hands.",
      ),
      image(
        "Fragrance: storm",
        fragranceStormShot,
        "AI product photo of a violet perfume bottle on a stone plinth under a stormy sky with lightning.",
      ),
      image(
        "Fragrance: levitation",
        fragranceLevitationShot,
        "AI product photo of a violet perfume bottle floating above an open hand in a dark, candle-lit room.",
      ),
      image(
        "Fragrance: portrait",
        fragrancePortraitShot,
        "Black and white AI portrait of a man holding a perfume bottle to his temple.",
      ),
    ],
  },
  {
    slug: "video-ads",
    name: "Video ads",
    intro:
      "Short-form video ads for social media and paid campaigns, cut for feeds, stories and reels.",
    aspect: "4/5",
    items: [
      video(
        "Worry-free driving",
        "/media/video-ads/video-ad-01.mp4",
        videoAd01Poster,
        "Lubricant bottles on a red stage with the line: Enjoy smooth, worry-free driving.",
        "0:07",
      ),
      video(
        "On the road brand story",
        "/media/video-ads/video-ad-02.mp4",
        videoAd02Poster,
        "An aerial view of a busy junction with the words: In traffic.",
        "0:59",
      ),
      video(
        "Engine oil range reel",
        "/media/video-ads/video-ad-03.mp4",
        videoAd03Poster,
        "An engine oil bottle on a red background with its grade and API rating.",
        "0:49",
      ),
      video(
        "Distributor recruitment ad",
        "/media/video-ads/video-ad-04.mp4",
        videoAd04Poster,
        "A fully synthetic engine oil bottle with protection and performance icons.",
        "0:25",
      ),
      video(
        "Product grades reel",
        "/media/video-ads/video-ad-05.mp4",
        videoAd05Poster,
        "An engine oil bottle on a podium with its 5W-20 grade in large type.",
        "0:21",
      ),
      video(
        "Product benefits reel",
        "/media/video-ads/video-ad-06.mp4",
        videoAd06Poster,
        "A lubricant brand logo above its product range on a red background.",
        "0:26",
      ),
      video(
        "Why choose us reel",
        "/media/video-ads/video-ad-07.mp4",
        videoAd07Poster,
        "A close-up of a lubricant bottle label reading advanced performance technology.",
        "0:18",
      ),
      video(
        "Private-label manufacturing ad",
        "/media/video-ads/video-ad-08.mp4",
        videoAd08Poster,
        'Blank "your brand name here" oil cans promoting private-label manufacturing.',
        "0:30",
      ),
      video(
        "Sludge-free protection reel",
        "/media/video-ads/video-ad-09.mp4",
        videoAd09Poster,
        "A gold engine oil bottle with a headline about its advanced protection formula.",
        "0:26",
      ),
      video(
        "Motorbike oil benefits",
        "/media/video-ads/video-ad-10.mp4",
        videoAd10Poster,
        "A motorbike engine oil bottle on a purple background with the line: Smoother gear shifting.",
        "0:15",
      ),
      video(
        "Product spec cards",
        "/media/video-ads/video-ad-11.mp4",
        videoAd11Poster,
        "A blue engine oil bottle beside its 0W-20 specification and a Contact us button.",
        "0:30",
      ),
      video(
        "Fully synthetic oil reel",
        "/media/video-ads/video-ad-12.mp4",
        videoAd12Poster,
        "Brown and green fully synthetic engine oil bottles with a 5W-40 grade label.",
        "0:29",
      ),
      video(
        "Switch-to story reel",
        "/media/video-ads/video-ad-13.mp4",
        videoAd13Poster,
        "A three-panel story about switching to a better engine oil, with driving photos.",
        "0:15",
      ),
      video(
        "Fully synthetic launch",
        "/media/video-ads/video-ad-14.mp4",
        videoAd14Poster,
        "A green engine oil bottle with the text: Fully synthetic SAE 10W-30, API SN.",
        "0:53",
      ),
      video(
        "Canada availability ad",
        "/media/video-ads/video-ad-15.mp4",
        videoAd15Poster,
        "Lubricant bottles under the headline Available in Canada, with contact details.",
        "0:16",
      ),
      video(
        "Brand portfolio showcase",
        "/media/video-ads/video-ad-16.mp4",
        videoAd16Poster,
        "A lineup of colourful engine oil cans from one brand's range.",
        "0:41",
      ),
    ],
  },
  {
    slug: "ai-video-ads",
    name: "AI video ads",
    intro:
      "Video ads built from AI-generated scenes and motion, finished with editing, music and brand messaging.",
    aspect: "16/9",
    items: [
      video(
        "Penguin cold-start story",
        "/media/ai-video-ads/ai-video-ad-01.mp4",
        aiVideoAd01Poster,
        "A penguin holding a four-litre bottle of engine oil in the snow.",
        "0:30",
      ),
      video(
        "Night-city motorbike ride",
        "/media/ai-video-ads/ai-video-ad-02.mp4",
        aiVideoAd02Poster,
        "A rider leaning a sports motorbike through a neon-lit city street at night.",
        "0:23",
      ),
      video(
        "Fully synthetic oil launch",
        "/media/ai-video-ads/ai-video-ad-03.mp4",
        aiVideoAd03Poster,
        "A gold bottle of fully synthetic 5W-30 engine oil in dramatic lighting.",
        "1:20",
      ),
      video(
        "Light-trail product reveal",
        "/media/ai-video-ads/ai-video-ad-04.mp4",
        aiVideoAd04Poster,
        "A red engine oil bottle circled by golden light trails.",
        "1:07",
      ),
      video(
        "Engine oil in space",
        "/media/ai-video-ads/ai-video-ad-05.mp4",
        aiVideoAd05Poster,
        "An orange engine oil can in front of a glowing sun and asteroids.",
        "1:10",
      ),
      video(
        "Comic-style motorbike ad",
        "/media/ai-video-ads/ai-video-ad-06.mp4",
        aiVideoAd06Poster,
        "A comic-book illustration of a rider on a sports motorbike with flames behind.",
        "0:49",
      ),
      video(
        "Circuit-board product reveal",
        "/media/ai-video-ads/ai-video-ad-07.mp4",
        aiVideoAd07Poster,
        "An engine oil bottle on a glowing green circuit board inside a ring of light.",
        "0:50",
      ),
      video(
        "Night-city rider and product",
        "/media/ai-video-ads/ai-video-ad-08.mp4",
        aiVideoAd08Poster,
        "A rider kneeling beside a motorbike on a neon-lit city street.",
        "0:41",
      ),
      video(
        "Sunrise ride product ad",
        "/media/ai-video-ads/ai-video-ad-09.mp4",
        aiVideoAd09Poster,
        "A rider in a leather suit beside motorbike oil bottles on a table.",
        "0:23",
      ),
    ],
  },
  {
    slug: "logo-animations",
    name: "Logo animations",
    intro: "Animated logo reveals and branded intros for videos, social posts and presentations.",
    aspect: "16/9",
    items: [
      video(
        "Tile adhesive: 3D build reveal",
        "/media/logo-animations/logo-animation-01.mp4",
        logoAnimation01Poster,
        "A tile adhesive brand logo on a white tiled background.",
        "0:08",
      ),
      video(
        "Tile adhesive: chrome logo",
        "/media/logo-animations/logo-animation-02.mp4",
        logoAnimation02Poster,
        "A chrome 3D logo for a tile adhesive brand on a grid floor.",
        "0:09",
      ),
      video(
        "Travel destinations intro",
        "/media/logo-animations/logo-animation-03.mp4",
        logoAnimation03Poster,
        "A California title card over the Golden Gate Bridge in a travel intro.",
        "0:30",
      ),
      video(
        "Accounting firm logo reveal",
        "/media/logo-animations/logo-animation-04.mp4",
        logoAnimation04Poster,
        "A green monogram logo for an accounting and tax services firm.",
        "0:10",
      ),
      video(
        "Travel agency 3D city reveal",
        "/media/logo-animations/logo-animation-05.mp4",
        logoAnimation05Poster,
        "A travel agency logo in front of 3D city landmarks and trees.",
        "0:12",
      ),
      video(
        "Visa consultancy: world landmarks",
        "/media/logo-animations/logo-animation-06.mp4",
        logoAnimation06Poster,
        "A visa consultancy logo with a plane and world landmarks.",
        "0:15",
      ),
      video(
        "Visa consultancy: route map",
        "/media/logo-animations/logo-animation-07.mp4",
        logoAnimation07Poster,
        "A visa consultancy logo in a glowing ring on a green world map.",
        "0:17",
      ),
      video(
        "Visa consultancy: flight over Europe",
        "/media/logo-animations/logo-animation-08.mp4",
        logoAnimation08Poster,
        "An aircraft wing flying over a map of Europe with country labels.",
        "0:32",
      ),
      video(
        "Study in Italy promo",
        "/media/logo-animations/logo-animation-09.mp4",
        logoAnimation09Poster,
        "An Italian flag and monument with the line: Start your academic journey in Italy.",
        "0:35",
      ),
      video(
        "Visa consultancy: Europe skyline",
        "/media/logo-animations/logo-animation-10.mp4",
        logoAnimation10Poster,
        "A visa consultancy logo above a Europe skyline in the clouds.",
        "0:16",
      ),
    ],
  },
];
