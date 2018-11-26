// @flow

// ----- Types ----- //

export type ImageType = 'jpg' | 'png';


// ----- Setup ----- //

export const GRID_DOMAIN = 'https://media.guim.co.uk';

export const imageCatalogue: {
  [string]: string,
} = {
  newsroom: '8caacf301dd036a2bbb1b458cf68b637d3c55e48/0_0_1140_683',
  guardianObserverOffice: '137d6b217a27acddf85512657d04f6490b9e0bb1/1638_0_3571_2009',
  liveEvent: '5f18c6428e9f31394b14215fe3c395b8f7b4238a/500_386_2373_1335',
  digitalBundle: '7c7b9580924281914e82dc163bf716ede52daa8b/0_0_600_360',
  paperBundle: '4d0851394ce3c100649800733f230a78c0d38555/0_0_600_360',
  paperDigitalBundle: '1199912112859eecf3f2d94edc6fdd73843d10e9/0_0_600_360',
  protestorsWide: 'bce7d14f7f837a4f6c854d95efc4b1eab93a8c65/0_0_5200_720',
  protestorsNarrow: 'd1a7088f8f2a367b0321528f081777c9b5618412/0_0_3578_2013',
  premiumTierCircle: '3e3b59228c3467b01dd09b9f79de28c586fe0ea6/0_0_825_825',
  dailyEditionCircle: '64ba1a800e4c2975054b33ba07c4fe3c64d4b5f4/0_0_825_825',
  digitalCircleOrange: '0b5ded2325275e25f5b38198766c57363bddfa21/0_0_825_825',
  digitalCirclePink: '7d404c1920f065c1b7e71b903cc3899f388acb22/0_0_825_825',
  paperCircle: 'c462d60f2962b745b1e206d5ede998dfb166a8ed/0_0_825_825',
  paperDigitalCircleOrange: 'd94c0f9bade09487b9afca5ee8149efb33f34ccf/0_0_825_825',
  paperDigitalCirclePink: '69d90e5d6fca261a227e47b311f80807b123c87b/0_0_825_825',
  weeklyCircle: '1be07b6ab77eccd128c720d013e5436e6e8eca61/0_0_2210_2210',
  premiumTier: 'fb0c788ddee28f8e0e66d814595cf81d6aa21ec6/0_0_644_448',
  premiumTierAU: '4b6fd9805c7d0a88b4b71a683c4b46279a410b9d/0_0_1610_1120',
  dailyEdition: '168cab5197d7b4c5d9e05eb3ff2801b2929f2995/0_0_644_448',
  windrush: '4addd475d3af57d908fa87124e556ab96fddb2e7/0_0_370_370',
  windrushGreyscale: '8637bed472263161e35de986b463ed0c3675987d/0_0_830_830',
  zuck: 'e6142101bc909caee866be05ced677c54e9d3b4e/0_0_374_374',
  digitalSubscriptionHeaderDesktop: '01f9a081d0f78cb057ca585725f2742bed5a98fb/0_0_4045_1945',
  digitalSubscriptionHeaderDesktopAU: 'f46b1e2c498ac4f1ebec1b2620b6e80583e4348f/0_0_4045_1945',
  digitalSubscriptionHeaderTablet: '4d588918cae445d7ded1e68960286fd91217434b/0_0_2035_1660',
  digitalSubscriptionHeaderTabletAU: 'dbe3974508706a41e710f198b1da02f44e6141a1/0_0_2035_1660',
  digitalSubscriptionHeaderMobile: 'ed4028ccd5abd85b330114e3ef48660358f63969/0_0_1200_1755',
  digitalSubscriptionHeaderMobileAU: 'dbe3974508706a41e710f198b1da02f44e6141a1/945_0_1088_1755',
  digitalSubscriptionPromotionPopUpHeader: 'd0322e698dc8b30337feefd3294c8b82882c353b/0_0_2770_1410',
  digitalPackBenefitsMobile: 'bd335622063afd12463bf286a2058008b5f05efc/0_0_1729_1505',
  digitalPackBenefitsDesktop: 'cb3028a5f9aaf0a1b46ba1594e90b9d3a0b2ad3e/0_0_3750_2000',
  investHeaderMobile: '91edfca98faf743fed826a1efc03ed0bf133625b/0_0_1875_1560',
  investHeaderDesktop: '60c2488def35887fe1d786fcb7cd9c8ff4c48735/0_0_7200_2645',
  adFreePromotionCircles: 'c95a636dd5388d9fd81a487c5929812e6f6962a1/0_0_1815_705',
  digitalPackFlashSaleDesktop: '496362ba165e8291991d6ec75725a4a57254adf1/0_0_1388_949',
  digitalPackFlashSaleMobile: '2dfb17d45d092baefa3301db8be0634815462941/0_0_717_470',
  guardianWeeklyHeroDesktop: '5095abab315d2919d6f6d438d16644452414be06/0_0_1080_784',
  guardianWeeklyHeroMobile: '0198392d89fac028dfea0c0aba940ef86eafdb10/0_0_1000_666',
  paperHeroDesktop: 'f1040916a71642c924a52c61dc7c4aae2b8dd88d/0_0_1080_784',
  paperHeroMobile: '9b8d348e9ba521c388e3482ece4037e3f0fb3864/0_0_1000_666',
  weeklyLandingHero: '3a093833e468eec890838eb36d462f0281299f9c/0_0_5060_5350',
  paperLandingHero: 'cf91f9718b1f8397eaa10eae1d02ae3f143f261f/0_0_2600_1192',
  paperLandingHeroMobile: 'c662f53516b202d56fed0a08c8f1cdbd1d132a92/0_0_924_696',
};

// Utility type: https://flow.org/en/docs/types/utilities/#toc-keys
export type ImageId = $Keys<typeof imageCatalogue>;


// ----- Functions ----- //

// Builds a grid url from and id and an image size.
// Example: https://media.guim.co.uk/g65756g5/300.jpg
export function gridUrl(
  gridId: ImageId,
  size: number,
  imgType?: ImageType = 'jpg',
): string {

  const path = `${imageCatalogue[gridId]}/${size}.${imgType}`;
  const url = new URL(path, GRID_DOMAIN);

  return url.toString();

}

// Returns a series of grid urls and their corresponding sizes.
// Example:
//   "https://media.guim.co.uk/g65756g5/300.jpg 300w,
//    https://media.guim.co.uk/g65756g5/500.jpg 500w,
//    https://media.guim.co.uk/g65756g5/700.jpg 700w"
export function gridSrcset(
  gridId: ImageId,
  sizes: number[],
  imgType?: ImageType,
): string {

  const sources = sizes.map(size => `${gridUrl(gridId, size, imgType)} ${size}w`);
  return sources.join(', ');

}
