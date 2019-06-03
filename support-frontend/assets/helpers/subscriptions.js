// @flow

// ----- Imports ----- //

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
  type BillingPeriod,
  Monthly,
  Quarterly,
} from 'helpers/billingPeriods';
import { trackComponentEvents } from './tracking/ophanComponentEventTracking';
import { gaEvent } from './tracking/googleTagManager';
import { currencies, detect } from './internationalisation/currency';
import { isTestSwitchedOn } from 'helpers/globals';
import type { PaperProductOptions } from 'helpers/productPrice/productOptions';

// ----- Types ------ //

const DigitalPack: 'DigitalPack' = 'DigitalPack';
const PremiumTier: 'PremiumTier' = 'PremiumTier';
const DailyEdition: 'DailyEdition' = 'DailyEdition';
const GuardianWeekly: 'GuardianWeekly' = 'GuardianWeekly';
const Paper: 'Paper' = 'Paper';
const PaperAndDigital: 'PaperAndDigital' = 'PaperAndDigital';

export type SubscriptionProduct =
  typeof DigitalPack |
  typeof PremiumTier |
  typeof DailyEdition |
  typeof GuardianWeekly |
  typeof Paper |
  typeof PaperAndDigital;

type OphanSubscriptionsProduct = 'DIGITAL_SUBSCRIPTION' | 'PRINT_SUBSCRIPTION';

export type ComponentAbTest = {
  name: string,
  variant: string,
};

const isPhysicalProduct = (product: SubscriptionProduct) => {
  switch (product) {
    case Paper:
    case PaperAndDigital:
    case GuardianWeekly:
      return true;
    default:
      return false;
  }
};

const dailyNewsstandPrice = 2.20;
const weekendNewsstandPrice = 3.20;
const newsstandPrices: {[PaperProductOptions]: number} = {
  Saturday: weekendNewsstandPrice,
  Sunday: weekendNewsstandPrice,
  Everyday: (dailyNewsstandPrice * 5) + (weekendNewsstandPrice * 2),
  Weekend: weekendNewsstandPrice * 2,
};

// ----- Config ----- //

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
  Paper: {
    GBPCountries: 10.79,
  },
  PaperAndDigital: {
    GBPCountries: 21.62,
  },
  DailyEdition: {
    GBPCountries: 11.99,
  },
};

const defaultBillingPeriods: {
  [SubscriptionProduct]: BillingPeriod
} = {
  PremiumTier: Monthly,
  DigitalPack: Monthly,
  GuardianWeekly: Quarterly,
  Paper: Monthly,
  PaperAndDigital: Monthly,
  DailyEdition: Monthly,
};


// ----- Functions ----- //

function fixDecimals(number: number): string {
  if (Number.isInteger(number)) {
    return number.toString();
  }
  return number.toFixed(2);
}

function getProductPrice(product: SubscriptionProduct, countryGroupId: CountryGroupId): string {
  return fixDecimals(subscriptionPricesForDefaultBillingPeriod[product][countryGroupId]);
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
  context?: string,
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
      label: (context ? context.concat('-') : '').concat(id),
    });

  };

}


// ----- Newsstand savings ----- //
const getMonthlyNewsStandPrice = (newsstand: number) => ((newsstand) * 52) / 12;

const getNewsstandSaving = (subscriptionMonthlyCost: number, newsstandWeeklyCost: number) =>
  fixDecimals(getMonthlyNewsStandPrice(newsstandWeeklyCost) - subscriptionMonthlyCost);

const getNewsstandPrice = (productOption: PaperProductOptions) =>
  newsstandPrices[productOption];


// Paper product
const paperHasDeliveryEnabled = (): boolean => isTestSwitchedOn('paperHomeDeliveryEnabled');


// ----- Exports ----- //

export {
  sendTrackingEventsOnClick,
  displayPrice,
  getProductPrice,
  getNewsstandSaving,
  getNewsstandPrice,
  fixDecimals,
  paperHasDeliveryEnabled,
  DigitalPack,
  PaperAndDigital,
  Paper,
  PremiumTier,
  DailyEdition,
  GuardianWeekly,
  isPhysicalProduct,
};
