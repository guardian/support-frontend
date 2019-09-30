// @flow
import React from 'react';
import { init as pageInit } from 'helpers/page/page';

// images
import FeaturePackshot from 'components/packshots/feature-packshot';
import GuardianWeeklyPackShot from 'components/packshots/guardian-weekly-packshot';
import PaperPackshot from 'components/packshots/paper-packshot';
import PremiumAppPackshot from 'components/packshots/premium-app-packshot';
import PaperAndDigitalPackshot from 'components/packshots/paper-and-digital-packshot';
import IntFeaturePackshot from 'components/packshots/int-feature-packshot';
import FullGuardianWeeklyPackShot from 'components/packshots/full-guardian-weekly-packshot';

// helpers
import { displayPrice, sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { getCampaign } from 'helpers/tracking/acquisitions';
import { getSubsLinks } from 'helpers/externalLinks';
import { androidAppUrl, getIosAppUrl } from 'helpers/externalLinks';
import trackAppStoreLink from 'components/subscriptionBundles/appCtaTracking';

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

const isUkProduct = product =>
  countryGroupId === 'GBPCountries' && `from ${displayPrice(product, countryGroupId)}`;

const chooseImage = images =>
  (countryGroupId === 'GBPCountries' ? images[0] : images[1]);

const digital = {
  title: 'Digital Pack',
  subtitle: `from ${displayPrice('DigitalPack', countryGroupId)}`,
  description: 'The Daily Edition app and Premium app in one pack, plus ad-free reading on all your devices',
  productImage: chooseImage([<FeaturePackshot />, <IntFeaturePackshot />]),
  offer: '50% off for 3 months',
  buttons: [{
    ctaButtonText: 'Find out more',
    link: subsLinks.DigitalPack,
  }],
  analyticsTracking: () => sendTrackingEventsOnClick('digipack_cta', 'DigitalPack', abTest, 'digital-subscription'),
  isFeature: true,
};

const guardianWeekly = {
  title: 'Guardian Weekly',
  subtitle: `${displayPrice('GuardianWeekly', countryGroupId)}`,
  description: 'A weekly, global magazine from The Guardian, with delivery worldwide',
  buttons: [{
    ctaButtonText: 'Find out more',
    link: subsLinks.GuardianWeekly,
  }],
  productImage: chooseImage([<GuardianWeeklyPackShot />, <FullGuardianWeeklyPackShot />]),
  analyticsTracking: () => sendTrackingEventsOnClick('weekly_cta', 'GuardianWeekly', abTest),
};

const paper = {
  title: 'Paper',
  subtitle: isUkProduct('Paper'),
  description: 'Save on The Guardian and The Observer\'s newspaper retail price all year round',
  buttons: [{
    ctaButtonText: 'Find out more',
    link: subsLinks.Paper,
  }],
  productImage: <PaperPackshot />,
  analyticsTracking: sendTrackingEventsOnClick('paper_cta', 'Paper', abTest, 'paper-subscription'),
};

const paperAndDigital = {
  title: 'Paper+Digital',
  subtitle: isUkProduct('PaperAndDigital'),
  description: 'Save on The Guardian and The Observer\'s newspaper retail price all year round',
  buttons: [{
    ctaButtonText: 'Find out more',
    link: subsLinks.PaperAndDigital,
  }],
  productImage: <PaperAndDigitalPackshot />,
  analyticsTracking: sendTrackingEventsOnClick('paper_digital_cta', 'PaperAndDigital', abTest, 'paper-and-digital-subscription'),
};

const premiumApp = {
  title: 'Premium App',
  subtitle: isUkProduct('PremiumTier'),
  description: 'Save on The Guardian and The Observer\'s newspaper retail price all year round',
  buttons: [{
    ctaButtonText: 'Buy in App Store',
    link: getIosAppUrl(countryGroupId),
    onClick: trackAppStoreLink('premium_tier_ios_cta', 'PremiumTier', abTest),
    // these buttons need a change there css so the text fits at 320px width
  }, {
    ctaButtonText: 'Buy on Google Play',
    link: androidAppUrl,
    onClick: trackAppStoreLink('premium_tier_android_cta', 'PremiumTier', abTest),
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
  ],
  International: [
    guardianWeekly,
    digital,
  ],
  AUDCountries: [
    guardianWeekly,
    digital,
  ],
  EURCountries: [
    guardianWeekly,
    digital,
  ],
  NZDCountries: [
    guardianWeekly,
    digital,
  ],
  Canada: [
    guardianWeekly,
    digital,
  ],
};

const subscriptionCopy = orderedProducts[countryGroupId];

export { subscriptionCopy };
