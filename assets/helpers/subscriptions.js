// @flow

// ----- Imports ----- //

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { AUD, CAD, EUR, GBP, NZD, type Price, USD } from 'helpers/internationalisation/price';
import { BillingPeriod, DigitalBillingPeriod, WeeklyBillingPeriod } from 'helpers/billingPeriods';
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

const digitalSubscriptionPrices = {
  GBPCountries: {
    Monthly: GBP(11.99),
    Annual: GBP(119.90),
  },
  UnitedStates: {
    Monthly: USD(19.99),
    Annual: USD(199.90),
  },
  AUDCountries: {
    Monthly: AUD(21.50),
    Annual: AUD(215.00),
  },
  EURCountries: {
    Monthly: EUR(14.99),
    Annual: EUR(149.90),
  },
  International: {
    Monthly: USD(19.99),
    Annual: USD(199.90),
  },
  NZDCountries: {
    Monthly: NZD(23.50),
    Annual: NZD(235.00),
  },
  Canada: {
    Monthly: CAD(21.95),
    Annual: CAD(219.50),
  },
};

const paperSubscriptionPrices = {
  collectionEveryday: GBP(47.62),
  collectionSixday: GBP(41.12),
  collectionWeekend: GBP(20.76),
  collectionSunday: GBP(10.79),
  deliveryEveryday: GBP(62.79),
  deliverySixday: GBP(54.12),
  deliveryWeekend: GBP(25.09),
  deliverySunday: GBP(15.12),
};

const subscriptionPromoPricesForGuardianWeekly: {
  [string]: {
    [CountryGroupId]: {
      [WeeklyBillingPeriod]: number,
    }
  }
} = {
  '10ANNUAL': {
    GBPCountries: {
      Quarterly: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.GBPCountries,
      SixForSix: 6,
      Annual: 135,
    },
    EURCountries: {
      Quarterly: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.EURCountries,
      SixForSix: 6,
      Annual: 220.68,
    },
    UnitedStates: {
      Quarterly: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.UnitedStates,
      SixForSix: 6,
      Annual: 270,
    },
    Canada: {
      Quarterly: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.Canada,
      SixForSix: 6,
      Annual: 288,
    },
    AUDCountries: {
      Quarterly: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.AUDCountries,
      SixForSix: 6,
      Annual: 351,
    },
    NZDCountries: {
      Quarterly: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.NZDCountries,
      SixForSix: 6,
      Annual: 442.8,
    },
    International: {
      Quarterly: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.International,
      SixForSix: 6,
      Annual: 292.68,
    },
  },
};

const subscriptionPricesForGuardianWeekly: {
  [CountryGroupId]: {
    [WeeklyBillingPeriod]: number,
  }
} = {
  GBPCountries: {
    Quarterly: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.GBPCountries,
    SixForSix: 6,
    Annual: 150,
  },
  EURCountries: {
    Quarterly: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.EURCountries,
    SixForSix: 6,
    Annual: 245.20,
  },
  UnitedStates: {
    Quarterly: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.UnitedStates,
    SixForSix: 6,
    Annual: 300,
  },
  Canada: {
    Quarterly: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.Canada,
    SixForSix: 6,
    Annual: 320,
  },
  AUDCountries: {
    Quarterly: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.AUDCountries,
    SixForSix: 6,
    Annual: 390,
  },
  NZDCountries: {
    Quarterly: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.NZDCountries,
    SixForSix: 6,
    Annual: 492,
  },
  International: {
    Quarterly: subscriptionPricesForDefaultBillingPeriod.GuardianWeekly.International,
    SixForSix: 6,
    Annual: 325.20,
  },
};

const defaultBillingPeriods: {
  [SubscriptionProduct]: BillingPeriod
} = {
  PremiumTier: 'Monthly',
  DigitalPack: 'Monthly',
  GuardianWeekly: 'Quarterly',
  Paper: 'Monthly',
  PaperAndDigital: 'Monthly',
  DailyEdition: 'Monthly',
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

function getWeeklyProductPrice(countryGroupId: CountryGroupId, billingPeriod: WeeklyBillingPeriod): string {
  return fixDecimals(subscriptionPricesForGuardianWeekly[countryGroupId][billingPeriod]);
}

function getPromotionWeeklyProductPrice(
  countryGroupId: CountryGroupId,
  billingPeriod: WeeklyBillingPeriod,
  promoCode: string,
): string {
  return fixDecimals(subscriptionPromoPricesForGuardianWeekly[promoCode][countryGroupId][billingPeriod]);
}

function getPaperPrice(billingPlan: PaperBillingPlan): Price {
  return paperSubscriptionPrices[billingPlan];
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
  getProductPrice,
  getWeeklyProductPrice,
  getPromotionWeeklyProductPrice,
  getNewsstandSaving,
  getNewsstandPrice,
  getDigitalPrice,
  getPaperPrice,
  fixDecimals,
};
