// @flow

// ----- Imports ----- //

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type Price, GBP, USD, AUD, EUR, NZD, CAD } from 'helpers/internationalisation/price';

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

export type DigitalBillingPeriod = 'month' | 'year';
export type BillingPeriod = 'sixweek' | 'quarter' | 'year' | 'month';
export type WeeklyBillingPeriod = 'sixweek' | 'quarter' | 'year';

export type PaperBillingPlan =
  'collectionEveryday' | 'collectionSixday' | 'collectionWeekend' | 'collectionSunday' |
  'deliveryEveryday' | 'deliverySixday' | 'deliveryWeekend' | 'deliverySunday';
export type PaperDeliveryMethod = 'collection' | 'delivery';
export type PaperNewsstandTiers = 'weekly' | 'saturday' | 'sunday';

const newsstandPrices: {[PaperNewsstandTiers]: number} = {
  weekly: 2 * 5,
  saturday: 2.9,
  sunday: 3,
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
    GBPCountries: 10.79,
  },
  PaperAndDigital: {
    GBPCountries: 21.62,
  },
  DailyEdition: {
    GBPCountries: 11.99,
  },
};

const discountPricesForDefaultBillingPeriod: {
  [SubscriptionProduct]: {
    [CountryGroupId]: number,
  }
} = {
  DigitalPack: {
    GBPCountries: 6,
    UnitedStates: 10,
    AUDCountries: 10.75,
    International: 10,
  },
  Paper: {
    GBPCountries: 5.40,
  },
  PaperAndDigital: {
    GBPCountries: 10.81,
  },
};

const digitalSubscriptionPrices = {
  GBPCountries: {
    month: GBP(11.99),
    year: GBP(119.90),
  },
  UnitedStates: {
    month: USD(19.99),
    year: USD(199.90),
  },
  AUDCountries: {
    month: AUD(21.50),
    year: AUD(215.00),
  },
  EURCountries: {
    month: EUR(14.99),
    year: EUR(149.90),
  },
  International: {
    month: USD(19.99),
    year: USD(199.90),
  },
  NZDCountries: {
    month: NZD(23.50),
    year: NZD(235.00),
  },
  Canada: {
    month: CAD(21.95),
    year: CAD(219.50),
  },
};

const PaperSubscriptionPrices = {
  collectionEveryday: GBP(47.62),
  collectionSixday: GBP(41.12),
  collectionWeekend: GBP(20.76),
  collectionSunday: GBP(10.79),
  deliveryEveryday: GBP(62.79),
  deliverySixday: GBP(54.12),
  deliveryWeekend: GBP(25.09),
  deliverySunday: GBP(15.12),
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

function fixDecimals(number: number): string {
  if (Number.isInteger(number)) {
    return number.toString();
  }
  return number.toFixed(2);
}

function getDigitalPrice(cgId: CountryGroupId, frequency: DigitalBillingPeriod): Price {
  return digitalSubscriptionPrices[cgId][frequency];
}

function getProductPrice(product: SubscriptionProduct, countryGroupId: CountryGroupId): string {
  return fixDecimals(subscriptionPricesForDefaultBillingPeriod[product][countryGroupId]);
}
function displayPrice(product: SubscriptionProduct, countryGroupId: CountryGroupId): string {
  const currency = currencies[detect(countryGroupId)].glyph;
  const price = getProductPrice(product, countryGroupId);
  return `${currency}${price}/${defaultBillingPeriods[product]}`;
}

function getDiscountedPrice(product: SubscriptionProduct, countryGroupId: CountryGroupId): string {
  return fixDecimals(discountPricesForDefaultBillingPeriod[product][countryGroupId]);
}

function discountedDisplayPrice(product: SubscriptionProduct, countryGroupId: CountryGroupId): string {
  const currency = currencies[detect(countryGroupId)].glyph;
  const price = getDiscountedPrice(product, countryGroupId);
  return `${currency}${price}/${defaultBillingPeriods[product]}`;
}

function getWeeklyProductPrice(countryGroupId: CountryGroupId, billingPeriod: WeeklyBillingPeriod): string {
  return subscriptionPricesForGuardianWeekly[countryGroupId][billingPeriod].toFixed(2);
}

function getPaperPrice(billingPlan: PaperBillingPlan): Price {
  return PaperSubscriptionPrices[billingPlan];
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

const getNewsstandPrice = (tiers: PaperNewsstandTiers[]) =>
  tiers.map(tier => newsstandPrices[tier]).reduce((a, b) => a + b, 0);

// ----- Exports ----- //

export {
  sendTrackingEventsOnClick,
  displayPrice,
  discountedDisplayPrice,
  getProductPrice,
  getWeeklyProductPrice,
  getNewsstandSaving,
  getNewsstandPrice,
  getDigitalPrice,
  getPaperPrice,
};
