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
  dailyEditionCircle: '9e992e4ebca7a837976fe55d091e0f38e7e595c2/0_0_3260_3260',
  digitalCircleOrange: 'd7d1820af432c48329d214d0cff7c6fe9cd21101/0_0_3260_3260',
  digitalCirclePink: '7d404c1920f065c1b7e71b903cc3899f388acb22/0_0_825_825',
  paperCircle: 'c462d60f2962b745b1e206d5ede998dfb166a8ed/0_0_825_825',
  paperDigitalCircleOrange: 'd94c0f9bade09487b9afca5ee8149efb33f34ccf/0_0_825_825',
  paperDigitalCirclePink: '69d90e5d6fca261a227e47b311f80807b123c87b/0_0_825_825',
  weeklyCircle: '8815acf2956182a72063ad82fdca93a366dfc0a0/0_0_2210_2210',
  premiumTier: 'fb0c788ddee28f8e0e66d814595cf81d6aa21ec6/0_0_644_448',
  premiumTierAU: '4b6fd9805c7d0a88b4b71a683c4b46279a410b9d/0_0_1610_1120',
  dailyEdition: '6c6bf7598935803cd9922af05bb35b435552d239/0_0_6440_4486',
  windrush: '4addd475d3af57d908fa87124e556ab96fddb2e7/0_0_370_370',
  windrushGreyscale: '8637bed472263161e35de986b463ed0c3675987d/0_0_830_830',
  zuck: 'e6142101bc909caee866be05ced677c54e9d3b4e/0_0_374_374',
  digitalSubscriptionHeaderDesktop: 'f9665e14b5927ee8ed94cc92204831b4f792c6dc/1407_0_7856_4260',
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
  guardianWeeklyHeroDesktop: 'e6cef2392beddf317d5c33574283b6cb08d20cc8/0_0_1000_738',
  guardianWeeklyHeroMobile: '25524d39392a5e66058f029e2e54bad42a315999/0_0_1998_1332',
  paperHeroDesktop: 'f1040916a71642c924a52c61dc7c4aae2b8dd88d/0_0_1080_784',
  paperHeroMobile: '9b8d348e9ba521c388e3482ece4037e3f0fb3864/0_0_1000_666',
  weeklyLandingHero: '04d26adc380c2d13015ba3b2bebf3cb8a7fe83a3/0_0_7100_3500',
  paperLandingHero: 'c09bbbff7ba75ea91b0d9da4ed750ab437f364c3/0_0_2676_1316',
  paperLandingHeroMobile: '7a1f17792f748c139a22321440e1c9294df82349/0_0_922_656',
  paperDeliveryFeature: 'e7527a726b840eeb1f94cfc6fdd004a31b90df20/0_0_920_820',
  paperVoucherFeature: '28c5d906226a50ee56a4046c628643a54f688dbd/0_0_750_694',
  UsCampaignLanding: '56fbd07b8e3b7090853dce5aa47c7153bd5c6e05/0_0_1500_1454',
  showcase: 'b72ef7a4c8764a163fc604d7b8edcedfdd7682f4/0_0_7100_3500',
  showcaseSubscribe: '1174d922f64d951a4a860e4b91b8dd5c5eb8cc8c/0_0_1802_1190',
  paperLandingSale: '6179a30718dab98e96230e39195f3aa2a2784a1d/0_0_800_858',
  theMomentDigiHero: 'd9d6da2b77bd9051456cb34ca5af9f79a2d55ae4/0_0_486_772',
  theMomentDigiHero2: '2f3d5a93ea03070a31db9d4a5f7d643fee718d99/0_0_486_772',
  theMomentDigiHero3: 'ffb39dac4ca084c49e547dc55367575671d28d23/0_0_486_772',
  weeklyCampaignHeroImg: '3d4bf412afdf3c91faed55c9507a6d741575e3c5/0_0_1358_954',
  checkoutPackshotPaperGraunVoucher: '5aa8702d1de22589ec5dd1a20a6cf4bc4b7c9674/0_0_696_400',
  checkoutPackshotDigitalPack: 'd68d6e6f276eae28d18851548e59bd7918a23ffc/0_0_1392_800',
  checkoutPackshotWeekly: '0fb50b636e09f459470453a54951ac6a7095c9e6/0_0_696_400',
  editionsProductBlock: 'bdb7361d9fc11a9c5c54fd5ca163a92bdb280714/0_0_2000_1364',
  noMoreAds: 'df9cbdeb0c45bdfcef4edb1466163eed0f020091/0_0_482_304',
  AppPremiumTier: 'dc9769250c22ca60da65a14e89676f59e82d46f5/0_0_1998_1338',
  showcaseAusProtest: 'b666c821d9b3e1085a2e07daeeb17fdeb82a077e/0_794_5472_2228',
  showcaseAusScottMorrison: 'd2d362b1aa48d477c3798ffe9d9c6954c3b1eea4/0_493_7173_2207',
  showcaseAusDetainees: '2c4ad048e2a2225e24b7414cd84c31b227a75270/313_0_1656_1656',
  showcaseAusAboriginal: 'b6e5c3e0d820e434a2907c4a89b8d52e13383435/0_44_3648_2188',
  showcaseUSTrump: '155025cc185b096d6038d1afd6b0881a367a7d05/647_0_2835_2835',
  showcaseUSProtest: '59eac0881f08224bdfac24d212f9f88c70a99c41/0_137_5134_3081',
  showcaseUSCongresswomen: 'bb3a380f53a4892f6ea51c0b6b20180d742f5c5d/0_511_3840_1042',
  showcaseUSZuckerberg: '115dd08550e90f00c1cc5bdf648cd33e270e290e/1014_211_2922_716',
  showcaseUKBrexit: '1806ede9cbb6b5b421f862b81a01bc1cb688ca48/6_1618_4250_927',
  showcaseUKChris: 'd80f77ff8069d1f39071a00a752cb2e8728d082a/381_0_2004_2004',
  showcaseUKFloods: 'cb8d5002ec1ac03e64da32d87fe7f804fc900dfb/163_1119_3136_789',
  showcaseUKWindrushGroup: '2ec9dab8f39d1e9b12b9c7625b5ad2b058f3420b/1175_287_3335_3335',
  subscriptionFeature: '432b55d4401dde2b58f6ce61e7c9ddf50958962a/0_0_1584_954',
  subscriptionWeekly1: 'cf47a92149f2b347fcd43e825e6e48c6601820f5/0_0_798_675',
  subscriptionWeekly2: '67d8da6245b1436aa767a5b5eaf853dddf1ce8ad/0_0_2035_2598',
  subscriptionWeekly3: 'd72bdce2c96e259939b33cc8a9c43e43d0129f7f/0_0_798_675',
  subscriptionFeast: '4fac3988229d109512b4dfa0930b126e36985a2c/0_0_660_636',
  subscriptionPrint: '/0575f214ad20536c7731172e36f349778df168c7/0_0_877_1090',
  subscriptionG2: 'f1cafef5a6bda2835f050042b9336645a24228ff/0_0_756_645',
  subscriptionIpad: 'c2843d4ec6bc7644c62c8691b6c7e83e76c93e0e/0_0_1302_998',
  subscriptionIphone: '8850945f0003d2a7204050644db446d827dead95/0_0_578_1096',
  subscriptionPrintDigital: '476a8aadac1f3a971b9b1a9a023b04cb72c8f7ca/0_0_1366_1510',
  subscriptionGuardianWeeklyPackShot: '299d99cb5dc2d98607e9333d5e1e15c9f7d4860f/0_0_1552_921',
  subscriptionDailyPackshot: '241d0d58656ffcd708bba7d2a42ec7b8df9ee25e/0_0_1584_898',
  subscriptionDailyMobile: '9b650a7dcc33e30d228ddec7bd27a0594b4ece41/0_0_568_1174',
  printShowcase: '311c4a9dd0e8030b734dd54b71fcd0d4cb2a303b/0_0_1486_750',
  digitalSubsDaily: '38e76951e5fa76f9b3eb02ab84c5d745f6b123b8/0_0_1693_1000',
  digitalSubsDailyMob: '93c8d64b7be3bf455f2f6f57d679c2fdc7df6bf3/0_0_1100_1100',
  digitalSubsApp: '234f5889b07c7c5d088d8d977e9e717ea8f2e791/0_0_1714_1000',
  digitalSubsAppMob: '59d2d83d9c1ecf8b3c955c63bf94ef2fa80c7353/0_0_1100_1100',
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
