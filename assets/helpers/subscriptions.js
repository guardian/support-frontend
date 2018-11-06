// @flow

// ----- Imports ----- //

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

import { trackComponentEvents } from './tracking/ophanComponentEventTracking';
import { gaEvent } from './tracking/googleTagManager';
import { currencies, detect } from './internationalisation/currency';


// ----- Types ------ //
export type SubscriptionProduct =
  'DigitalPack' |
  'PremiumTier' |
  'DailyEdition' |
  'GuardianWeekly' |
  'Paper' |
  'PaperAndDigital';

type OphanSubscriptionsProduct = 'DIGITAL_SUBSCRIPTION' | 'PRINT_SUBSCRIPTION';

export type ComponentAbTest = {
  name: string,
  variant: string,
};


// ----- Config ----- //
const billingPeriods = {
  sixweek: 'sixweek', quarter: 'quarter', year: 'year', month: 'month',
};
const weeklyBillingPeriods = {
  sixweek: 'sixweek',
  quarter: 'quarter',
  year: 'year',
};

export type BillingPeriod = $Keys<typeof billingPeriods>;
export type WeeklyBillingPeriod = BillingPeriod & $Keys<typeof weeklyBillingPeriods>;

const subscriptionPrices: {
  [SubscriptionProduct]: {
    [CountryGroupId]: {
      [BillingPeriod]: number
    },
  }
} = {
  PremiumTier: {
    GBPCountries: { month: 5.99 },
    UnitedStates: { month: 6.99 },
    AUDCountries: { month: 7.99 },
    International: { month: 5.99 },
  },
  DigitalPack: {
    GBPCountries: { month: 11.99 },
    UnitedStates: { month: 19.99 },
    AUDCountries: { month: 21.50 },
    International: { month: 19.99 },
  },
  GuardianWeekly: {
    GBPCountries: { quarter: 37.50, sixweek: 6, year: 150 },
    EURCountries: { quarter: 61.30, sixweek: 6, year: 245.20 },
    UnitedStates: { quarter: 75, sixweek: 6, year: 300 },
    Canada: { quarter: 80, sixweek: 6, year: 320 },
    AUDCountries: { quarter: 97.50, sixweek: 6, year: 390 },
    NZDCountries: { quarter: 123, sixweek: 6, year: 492 },
    International: { quarter: 81.30, sixweek: 6, year: 325.20 },
  },
  Paper: {
    GBPCountries: { month: 10.36 },
  },
  PaperAndDigital: {
    GBPCountries: { month: 21.62 },
  },
  DailyEdition: {
    GBPCountries: { month: 11.99 },
  },
};

const defaultBillingPeriods: {
  [SubscriptionProduct]: BillingPeriod
} = {
  PremiumTier: 'month',
  DigitalPack: 'month',
  GuardianWeekly: 'quarter',
  Paper: 'month',
  PaperAndDigital: 'month',
  DailyEdition: 'month',
};


// ----- Functions ----- //

function getProductPrice(
  product: SubscriptionProduct,
  countryGroupId: CountryGroupId,
  billingPeriod?: BillingPeriod,
): string {
  const useBillingPeriod = billingPeriod || defaultBillingPeriods[product];
  const price = subscriptionPrices[product][countryGroupId][useBillingPeriod].toFixed(2);
  if (!price) { throw new Error(`Missing price for ${product}/${countryGroupId}/${useBillingPeriod}`); }
  return price;
}

function displayPrice(
  product: SubscriptionProduct,
  countryGroupId: CountryGroupId,
  billingPeriod?: BillingPeriod,
): string {
  const useBillingPeriod: BillingPeriod = billingPeriod || defaultBillingPeriods[product];
  const currency = currencies[detect(countryGroupId)].glyph;
  const price = getProductPrice(product, countryGroupId, billingPeriod);
  return `${currency}${price}/${useBillingPeriod}`;
}

function ophanProductFromSubscriptionProduct(product: SubscriptionProduct): OphanSubscriptionsProduct {

  switch (product) {
    case 'DigitalPack':
    case 'PremiumTier':
    case 'DailyEdition':
      return 'DIGITAL_SUBSCRIPTION';
    case 'GuardianWeekly':
    case 'Paper':
    case 'PaperAndDigital':
    default:
      return 'PRINT_SUBSCRIPTION';
  }

}

function sendTrackingEventsOnClick(
  id: string,
  product: SubscriptionProduct,
  abTest: ComponentAbTest | null,
): () => void {

  const componentEvent = {
    component: {
      componentType: 'ACQUISITIONS_BUTTON',
      id,
      products: [ophanProductFromSubscriptionProduct(product)],
    },
    action: 'CLICK',
    id,
    ...(abTest ? { abTest } : {}),
  };

  return () => {

    trackComponentEvents(componentEvent);

    gaEvent({
      category: 'click',
      action: product,
      label: id,
    });

  };

}


// ----- Exports ----- //

export {
  sendTrackingEventsOnClick,
  displayPrice,
  getProductPrice,
};
