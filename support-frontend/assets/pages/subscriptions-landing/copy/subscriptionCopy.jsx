// @flow
import * as React from 'react';
import { init as pageInit } from 'helpers/page/page';
import { type SubscriptionProduct } from 'helpers/subscriptions';
import { displayPrice, sendTrackingEventsOnClick, subscriptionPricesForDefaultBillingPeriod } from 'helpers/subscriptions';
import { getCampaign } from 'helpers/tracking/acquisitions';
import { getSubsLinks } from 'helpers/externalLinks';
import { androidAppUrl, getIosAppUrl } from 'helpers/externalLinks';
import trackAppStoreLink from 'components/subscriptionBundles/appCtaTracking';

// images
import GuardianWeeklyPackShot from 'components/packshots/guardian-weekly-packshot';
import PaperPackshot from 'components/packshots/paper-packshot';
import PremiumAppPackshot from 'components/packshots/premium-app-packshot';
import PaperAndDigitalPackshot from 'components/packshots/paper-and-digital-packshot';
import FullGuardianWeeklyPackShot from 'components/packshots/full-guardian-weekly-packshot';
import SubscriptionDailyPackshot from 'components/packshots/subscription-daily-packshot';
import InternationalDailyPackshot from 'components/packshots/international-daily-packshot';

// constants
import { DigitalPack, PremiumTier, GuardianWeekly, Paper, PaperAndDigital } from 'helpers/subscriptions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { Option } from 'helpers/types/option';
import {
  flashSaleIsActive,
  getDisplayFlashSalePrice,
  getSaleCopy,
} from 'helpers/flashSale';
import { Monthly } from 'helpers/billingPeriods';
import {
  fromCountryGroupId,
  glyph,
} from 'helpers/internationalisation/currency';

// types

export type ProductButton = {
  ctaButtonText: string,
  link: string,
  analyticsTracking: Function,
}

type ProductCopy = {
  title: string,
  subtitle: Option<string>,
  description: string,
  productImage: React.Node,
  offer?: string,
  buttons: ProductButton[],
  isFeature?: boolean,
}

// store
const store = pageInit();
const commonStore = store.getState().common;
const { countryGroupId } = commonStore.internationalisation;
const { referrerAcquisitionData, abParticipations } = commonStore;

const abTest = null;

const subsLinks = getSubsLinks(
  countryGroupId,
  referrerAcquisitionData.campaignCode,
  getCampaign(referrerAcquisitionData),
  referrerAcquisitionData,
  abParticipations,
);

const getPrice = (product: SubscriptionProduct, alternativeText: string) => {

  if (flashSaleIsActive(product, countryGroupId)) {
    return getDisplayFlashSalePrice(product, countryGroupId, Monthly);
  }

  if (subscriptionPricesForDefaultBillingPeriod[product][countryGroupId]) {
    return `${displayPrice(product, countryGroupId)}`;
  }

  return alternativeText;
};

function getGuardianWeeklyOfferCopy() {
  const copy = getSaleCopy(GuardianWeekly, countryGroupId).bundle.subHeading;
  if (copy !== '') {
    return copy;
  }
  const currency = glyph(fromCountryGroupId(countryGroupId) || 'GBP');
  return `6 issues for ${currency}6`;
}

const chooseImage = images =>
  (countryGroupId === 'GBPCountries' || countryGroupId === 'EURCountries' || countryGroupId === 'International' ? images[0] : images[1]);

const digital: ProductCopy = {
  title: 'Digital Subscription',
  subtitle: getPrice(DigitalPack, ''),
  description: 'The Guardian Daily, Premium access to The Guardian Live app and ad-free reading on theguardian.com',
  productImage: chooseImage([<SubscriptionDailyPackshot />, <InternationalDailyPackshot />]),
  offer: getSaleCopy(DigitalPack, countryGroupId).bundle.subHeading,
  buttons: [{
    ctaButtonText: 'Find out more',
    link: subsLinks.DigitalPack,
    analyticsTracking: sendTrackingEventsOnClick('digipack_cta', 'DigitalPack', abTest, 'digital-subscription'),
  }],
  isFeature: true,
};

const guardianWeekly: ProductCopy = {
  title: 'The Guardian Weekly',
  subtitle: getPrice(GuardianWeekly, ''),
  description: 'A weekly, global magazine from The Guardian, with delivery worldwide',
  offer: getGuardianWeeklyOfferCopy(),
  buttons: [{
    ctaButtonText: 'Find out more',
    link: subsLinks.GuardianWeekly,
    analyticsTracking: sendTrackingEventsOnClick('weekly_cta', 'GuardianWeekly', abTest),
  }],
  productImage: chooseImage([<GuardianWeeklyPackShot />, <FullGuardianWeeklyPackShot />]),
};

const paper: ProductCopy = {
  title: 'Paper',
  subtitle: `from ${getPrice(Paper, '')}`,
  description: 'Save on The Guardian and The Observer\'s newspaper retail price all year round',
  buttons: [{
    ctaButtonText: 'Find out more',
    link: subsLinks.Paper,
    analyticsTracking: sendTrackingEventsOnClick('paper_cta', Paper, abTest, 'paper-subscription'),
  }],
  productImage: <PaperPackshot />,
  offer: getSaleCopy(Paper, countryGroupId).bundle.subHeading,
};

const paperAndDigital: ProductCopy = {
  title: 'Paper+Digital',
  subtitle: `from ${getPrice(PaperAndDigital, '')}`,
  description: 'All the benefits of a paper subscription, plus access to the digital subscription',
  buttons: [{
    ctaButtonText: 'Find out more',
    link: subsLinks.PaperAndDigital,
    analyticsTracking: sendTrackingEventsOnClick('paper_digital_cta', PaperAndDigital, abTest, 'paper-and-digital-subscription'),
  }],
  productImage: <PaperAndDigitalPackshot />,
  offer: getSaleCopy(PaperAndDigital, countryGroupId).bundle.subHeading,
};

const premiumApp: ProductCopy = {
  title: 'Premium App',
  subtitle: getPrice(PremiumTier, '7-day free Trial'),
  description: 'The ad-free, Premium App, designed especially for your smartphone and tablet',
  buttons: [{
    ctaButtonText: 'Buy in App Store',
    link: getIosAppUrl(countryGroupId),
    analyticsTracking: trackAppStoreLink('premium_tier_ios_cta', 'PremiumTier', abTest),
  }, {
    ctaButtonText: 'Buy on Google Play',
    link: androidAppUrl,
    analyticsTracking: trackAppStoreLink('premium_tier_android_cta', 'PremiumTier', abTest),
  }],
  productImage: <PremiumAppPackshot />,
  classModifier: ['subscriptions__premuim-app'],
};

const orderedProducts: { [CountryGroupId]: ProductCopy[] } = {
  GBPCountries: [
    digital,
    guardianWeekly,
    paper,
    paperAndDigital,
    premiumApp,
  ],
  UnitedStates: [
    guardianWeekly,
    digital,
    premiumApp,
  ],
  International: [
    digital,
    guardianWeekly,
    premiumApp,
  ],
  AUDCountries: [
    guardianWeekly,
    digital,
    premiumApp,
  ],
  EURCountries: [
    digital,
    guardianWeekly,
    premiumApp,
  ],
  NZDCountries: [
    guardianWeekly,
    digital,
    premiumApp,
  ],
  Canada: [
    guardianWeekly,
    digital,
    premiumApp,
  ],
};

const subscriptionCopy = orderedProducts[countryGroupId];

export { subscriptionCopy };
