// @flow

// ----- Imports ----- //

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { SubscriptionProduct } from './subscriptions';

// ----- Terms & Conditions ----- //

const defaultContributionTermsLink: string = 'https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions';

const contributionsTermsLinks: {
  [CountryGroupId]: string,
} = {
  GBPCountries: defaultContributionTermsLink,
  UnitedStates: 'https://www.theguardian.com/info/2016/apr/07/us-contribution-terms-and-conditions',
  AUDCountries: 'https://www.theguardian.com/info/2016/apr/08/australia-contribution-terms-and-conditions',
  EURCountries: defaultContributionTermsLink,
  International: defaultContributionTermsLink,
  NZDCountries: defaultContributionTermsLink,
  Canada: defaultContributionTermsLink,
};

const subscriptionsTermsLinks: {
  [SubscriptionProduct]: string,
} = {
  DigitalPack: 'https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions',
  PremiumTier: 'https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions',
  DailyEdition: 'https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions',
  GuardianWeekly: 'https://www.theguardian.com/info/2014/jul/10/guardian-weekly-print-subscription-services-terms-conditions',
  Paper: 'https://www.theguardian.com/info/2014/jul/10/guardian-weekly-print-subscription-services-terms-conditions',
  PaperAndDigital: 'https://www.theguardian.com/info/2014/jul/10/guardian-weekly-print-subscription-services-terms-conditions',
};

const privacyLink = 'https://www.theguardian.com/help/privacy-policy';
const defaultContributionEmail = 'mailto:contribution.support@theguardian.com';

const copyrightNotice = `\u00A9 ${(new Date()).getFullYear()} Guardian News and Media Limited or its
  affiliated companies. All rights reserved.`;

const contributionsEmail: {
    [CountryGroupId]: string,
} = {
  AUDCountries: 'mailto:apac.help@theguardian.com',
  GBPCountries: defaultContributionEmail,
  UnitedStates: defaultContributionEmail,
  EURCountries: defaultContributionEmail,
  International: defaultContributionEmail,
  NZDCountries: defaultContributionEmail,
  Canada: defaultContributionEmail,
};


// ----- Exports ----- //

export {
  contributionsTermsLinks,
  subscriptionsTermsLinks,
  privacyLink,
  copyrightNotice,
  contributionsEmail,
};
