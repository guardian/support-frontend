// @flow
import React from 'react';
import { init as pageInit } from 'helpers/page/page';

// type
import { type SubscriptionProduct } from 'helpers/subscriptions';

// images
import FeaturePackshot from 'components/packshots/feature-packshot';
import GuardianWeeklyPackShot from 'components/packshots/guardian-weekly-packshot';
import PaperPackshot from 'components/packshots/paper-packshot';
import PremiumAppPackshot from 'components/packshots/premium-app-packshot';
import PaperAndDigitalPackshot from 'components/packshots/paper-and-digital-packshot';
import IntFeaturePackshot from 'components/packshots/int-feature-packshot';
import FullGuardianWeeklyPackShot from 'components/packshots/full-guardian-weekly-packshot';

// helpers
import { displayPrice, sendTrackingEventsOnClick, subscriptionPricesForDefaultBillingPeriod } from 'helpers/subscriptions';
import { getCampaign } from 'helpers/tracking/acquisitions';
import { getSubsLinks } from 'helpers/externalLinks';
import { androidAppUrl, getIosAppUrl } from 'helpers/externalLinks';
import trackAppStoreLink from 'components/subscriptionBundles/appCtaTracking';

// constants
import { DigitalPack, PremiumTier, GuardianWeekly, Paper, PaperAndDigital } from 'helpers/subscriptions';

// store
const store = pageInit();
const commonStore = store.getState().common;
const { countryGroupId } = commonStore.internationalisation;
const { referrerAcquisitionData, abParticipations, optimizeExperiments } = commonStore;

const abTest = null;

const subsLinks = getSubsLinks(
  countryGroupId,
  referrerAcquisitionData.campaignCode,
  getCampaign(referrerAcquisitionData),
  referrerAcquisitionData,
  abParticipations,
  optimizeExperiments,
);

const PREMIUM_APP_ALT_TEXT = '7-day free Trial';

const hasPrice = (product: SubscriptionProduct, alternativeText: string) => { // add Flow types

  if (subscriptionPricesForDefaultBillingPeriod[product][countryGroupId]) {
    return `${displayPrice(product, countryGroupId)}`;
  }

  return alternativeText;
};

const isUkProduct = product =>
  countryGroupId === 'GBPCountries' && `from ${displayPrice(product, countryGroupId)}`;

const chooseImage = images =>
  (countryGroupId === 'GBPCountries' ? images[0] : images[1]);

const digital = {
  title: 'Digital Pack',
  subtitle: hasPrice(DigitalPack, ''),
  description: 'The Daily Edition app and Premium app in one pack, plus ad-free reading on all your devices',
  productImage: chooseImage([<FeaturePackshot />, <IntFeaturePackshot />]),
  offer: '50% off for 3 months',
  buttons: [{
    ctaButtonText: 'Find out more',
    link: subsLinks.DigitalPack,
    analyticsTracking: sendTrackingEventsOnClick('digipack_cta', 'DigitalPack', abTest, 'digital-subscription'),
  }],
  isFeature: true,
};

const guardianWeekly = {
  title: 'Guardian Weekly',
  subtitle: hasPrice(GuardianWeekly, ''),
  description: 'A weekly, global magazine from The Guardian, with delivery worldwide',
  buttons: [{
    ctaButtonText: 'Find out more',
    link: subsLinks.GuardianWeekly,
    analyticsTracking: sendTrackingEventsOnClick('weekly_cta', 'GuardianWeekly', abTest),
  }],
  productImage: chooseImage([<GuardianWeeklyPackShot />, <FullGuardianWeeklyPackShot />]),
};

const paper = {
  title: 'Paper',
  subtitle: isUkProduct(Paper),
  description: 'Save on The Guardian and The Observer\'s newspaper retail price all year round',
  buttons: [{
    ctaButtonText: 'Find out more',
    link: subsLinks.Paper,
    analyticsTracking: sendTrackingEventsOnClick('paper_cta', Paper, abTest, 'paper-subscription'),
  }],
  productImage: <PaperPackshot />,
  offer: 'Save up to 52% for a year',
};

const paperAndDigital = {
  title: 'Paper+Digital',
  subtitle: isUkProduct(PaperAndDigital),
  description: 'All the benefits of a paper subscription, plus access to the digital pack',
  buttons: [{
    ctaButtonText: 'Find out more',
    link: subsLinks.PaperAndDigital,
    analyticsTracking: sendTrackingEventsOnClick('paper_digital_cta', PaperAndDigital, abTest, 'paper-and-digital-subscription'),
  }],
  productImage: <PaperAndDigitalPackshot />,
};

const premiumApp = {
  title: 'Premium App',
  subtitle: hasPrice(PremiumTier, PREMIUM_APP_ALT_TEXT),
  description: 'The ad-free, Premium App, designed especially for your smartphone and tablet',
  buttons: [{
    ctaButtonText: 'Buy in App Store',
    link: getIosAppUrl(countryGroupId),
    analyticsTracking: trackAppStoreLink('premium_tier_ios_cta', 'PremiumTier', abTest),
    // these buttons need a change there css so the text fits at 320px width
  }, {
    ctaButtonText: 'Buy on Google Play',
    link: androidAppUrl,
    analyticsTracking: trackAppStoreLink('premium_tier_android_cta', 'PremiumTier', abTest),
  }],
  productImage: <PremiumAppPackshot />,
  classModifier: ['subscriptions__premuim-app'],
};

const orderedProducts = {
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
    guardianWeekly,
    digital,
    premiumApp,
  ],
  AUDCountries: [
    guardianWeekly,
    digital,
    premiumApp,
  ],
  EURCountries: [
    guardianWeekly,
    digital,
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
