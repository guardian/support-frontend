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
  'PaperAndDigital' |
  'Weekly';

type OphanSubscriptionsProduct = 'DIGITAL_SUBSCRIPTION' | 'PRINT_SUBSCRIPTION';

export type ComponentAbTest = {
  name: string,
  variant: string,
};


// ----- Config ----- //

type BillingPeriod = 'sixweek' | 'quarter' | 'year' | 'month';
export type WeeklyBillingPeriod = BillingPeriod & 'sixweek' | 'quarter' | 'year';

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
    GBPCountries: { quarter: 37.50 },
    UnitedStates: { quarter: 75 },
    AUDCountries: { quarter: 97.50 },
    International: { quarter: 81.30 },
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
  [SubscriptionProduct]: BillingPeriod,
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
  const useBillingPeriod: BillingPeriod = billingPeriod || defaultBillingPeriods[product];
  return subscriptionPrices[product][countryGroupId][useBillingPeriod].toFixed(2);
}

function displayPrice(product: SubscriptionProduct, countryGroupId: CountryGroupId): string {
  const currency = currencies[detect(countryGroupId)].glyph;
  const price = getProductPrice(product, countryGroupId);
  return `${currency}${price}/${defaultBillingPeriods[product]}`;
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
