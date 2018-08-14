// @flow

// ----- Imports ----- //

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

import { trackComponentEvents } from './tracking/ophanComponentEventTracking';
import { gaEvent } from './tracking/googleTagManager';
import { currencies, detect } from './internationalisation/currency';
import { getDiscountedPrice } from './flashSale';

// ----- Types ------ //

export type SubscriptionProduct =
  'DigitalPack' |
  'PremiumTier' |
  'DailyEdition' |
  'GuardianWeekly' |
  'Paper' |
  'PaperAndDigital';

// ----- Config ----- //

const subscriptionPrices: {
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
    GBPCountries: 30,
    UnitedStates: 60,
    AUDCountries: 78,
    International: 65,
  },
  Paper: {
    GBPCountries: 10.36,
  },
  PaperAndDigital: {
    GBPCountries: 21.62,
  },
  DailyEdition: {
    GBPCountries: 6.99,
  },
};

const defaultBillingPeriods: {
  [SubscriptionProduct]: string,
} = {
  PremiumTier: 'month',
  DigitalPack: 'month',
  GuardianWeekly: 'quarter',
  Paper: 'month',
  PaperAndDigital: 'month',
  DailyEdition: 'month',
};

function getProductPrice(product: SubscriptionProduct, countryGroupId: CountryGroupId): string {
  const price = subscriptionPrices[product][countryGroupId];
  const discounted = getDiscountedPrice(product, price);
  return Number.isInteger(discounted) ? discounted.toString() : discounted.toFixed(2);
}

function displayPrice(product: SubscriptionProduct, countryGroupId: CountryGroupId): string {
  const currency = currencies[detect(countryGroupId)].glyph;
  const price = getProductPrice(product, countryGroupId);
  return `${currency}${price}/${defaultBillingPeriods[product]}`;
}

function sendTrackingEventsOnClick(
  id: string,
  product: 'digital' | 'print',
  abTest: string,
  variant: boolean,
): () => void {

  return () => {

    trackComponentEvents({
      component: {
        componentType: 'ACQUISITIONS_BUTTON',
        id,
        products: product === 'digital' ? ['DIGITAL_SUBSCRIPTION'] : ['PRINT_SUBSCRIPTION'],
      },
      action: 'CLICK',
      id: `${abTest}${id}`,
      abTest: {
        name: `${abTest}`,
        variant: variant ? 'variant' : 'control',
      },
    });

    gaEvent({
      category: 'click',
      action: `${abTest}`,
      label: id,
    });

  };

}

// ----- Exports ----- //

export { sendTrackingEventsOnClick, displayPrice, getProductPrice };
