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

const subscriptionPricesForDefaultBillingPeriod: {
  [SubscriptionProduct]: {
    [CountryGroupId]: number,
  }
} = {
  PremiumTier: {
    GBPCountries: 5.99,
    UnitedStates: 6.99,
    AUDCountries: 7.99,
    International: 5.99,
  },
  DigitalPack: {
    GBPCountries: 11.99,
    UnitedStates: 19.99,
    AUDCountries: 21.50,
    International: 19.99,
  },
  GuardianWeekly: {
    GBPCountries: 37.50,
    EURCountries: 61.30,
    UnitedStates: 75,
    Canada: 80,
    AUDCountries: 97.50,
    NZDCountries: 123,
    International: 81.30,
  },
  Paper: {
    GBPCountries: 10.36,
  },
  PaperAndDigital: {
    GBPCountries: 21.62,
  },
  DailyEdition: {
    GBPCountries: 11.99,
  },
};

const subscriptionPricesForGuardianWeekly: {
  [CountryGroupId]: {
    [WeeklyBillingPeriod]: number,
  }
} = {
  GBPCountries: {
    quarter: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.GBPCountries,
    sixweek: 6,
    year: 150,
  },
  EURCountries: {
    quarter: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.EURCountries,
    sixweek: 6,
    year: 245.20,
  },
  UnitedStates: {
    quarter: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.UnitedStates,
    sixweek: 6,
    year: 300,
  },
  Canada: {
    quarter: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.Canada,
    sixweek: 6,
    year: 320,
  },
  AUDCountries: {
    quarter: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.AUDCountries,
    sixweek: 6,
    year: 390,
  },
  NZDCountries: {
    quarter: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.NZDCountries,
    sixweek: 6,
    year: 492,
  },
  International: {
    quarter: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.International,
    sixweek: 6,
    year: 325.20,
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

function getProductPrice(product: SubscriptionProduct, countryGroupId: CountryGroupId): string {
  return subscriptionPricesForDefaultBillingPeriod[product][countryGroupId].toFixed(2);
}
function displayPrice(product: SubscriptionProduct, countryGroupId: CountryGroupId): string {
  const currency = currencies[detect(countryGroupId)].glyph;
  const price = getProductPrice(product, countryGroupId);
  return `${currency}${price}/${defaultBillingPeriods[product]}`;
}

function getWeeklyProductPrice(countryGroupId: CountryGroupId, billingPeriod: WeeklyBillingPeriod): string {
  return subscriptionPricesForGuardianWeekly[countryGroupId][billingPeriod].toFixed(2);
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
  getWeeklyProductPrice,
};
