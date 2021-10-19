// ----- Imports ----- //
import type { CountryGroupId } from "helpers/internationalisation/countryGroup";
import type { BillingPeriod } from "helpers/productPrice/billingPeriods";
import { Monthly, Quarterly } from "helpers/productPrice/billingPeriods";
import { trackComponentEvents } from "../tracking/ophan";
import type { OphanAction, OphanComponentEvent, OphanComponentType } from "../tracking/ophan";
import { currencies, detect } from "../internationalisation/currency";
import { isTestSwitchedOn } from "helpers/globalsAndSwitches/globals";
import type { PaperProductOptions } from "helpers/productPrice/productOptions";
// ----- Types ------ //
const DigitalPack: "DigitalPack" = 'DigitalPack';
const PremiumTier: "PremiumTier" = 'PremiumTier';
const DailyEdition: "DailyEdition" = 'DailyEdition';
const GuardianWeekly: "GuardianWeekly" = 'GuardianWeekly';
const Paper: "Paper" = 'Paper';
const PaperAndDigital: "PaperAndDigital" = 'PaperAndDigital';
export type SubscriptionProduct = typeof DigitalPack | typeof PremiumTier | typeof DailyEdition | typeof GuardianWeekly | typeof Paper | typeof PaperAndDigital;
type OphanSubscriptionsProduct = "DIGITAL_SUBSCRIPTION" | "PRINT_SUBSCRIPTION";
export type ComponentAbTest = {
  name: string;
  variant: string;
};
type TrackingProperties = {
  id: string;
  product?: SubscriptionProduct;
  abTest?: ComponentAbTest;
  componentType: OphanComponentType;
};
// ----- Config ----- //
const dailyNewsstandPrice = 2.20;
const weekendNewsstandPrice = 3.20;
const newsstandPrices: Record<PaperProductOptions, number> = {
  Saturday: weekendNewsstandPrice,
  Sunday: weekendNewsstandPrice,
  Everyday: dailyNewsstandPrice * 5 + weekendNewsstandPrice * 2,
  Weekend: weekendNewsstandPrice * 2,
  Sixday: dailyNewsstandPrice * 5 + weekendNewsstandPrice
};
export const subscriptionPricesForDefaultBillingPeriod: Record<SubscriptionProduct, Record<CountryGroupId, number>> = {
  PaperAndDigital: {
    GBPCountries: 21.99
  }
};
const defaultBillingPeriods: Record<SubscriptionProduct, BillingPeriod> = {
  PremiumTier: Monthly,
  DigitalPack: Monthly,
  GuardianWeekly: Quarterly,
  Paper: Monthly,
  PaperAndDigital: Monthly,
  DailyEdition: Monthly
};

// ----- Functions ----- //
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

// ----- Ophan Tracking ----- //
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

const sendTrackingEvent = (trackingProperties: TrackingProperties & {
  action: OphanAction;
}): void => {
  const {
    id,
    product,
    abTest,
    componentType,
    action
  } = trackingProperties;
  const componentEvent: OphanComponentEvent = {
    component: {
      componentType,
      id,
      products: product ? [ophanProductFromSubscriptionProduct(product)] : []
    },
    action,
    id,
    ...(abTest ? {
      abTest
    } : {})
  };
  trackComponentEvents(componentEvent);
};

const sendTrackingEventsOnClick = (trackingProperties: TrackingProperties): () => void => () => {
  sendTrackingEvent({ ...trackingProperties,
    action: 'CLICK'
  });
};

const sendTrackingEventsOnView = (trackingProperties: TrackingProperties): () => void => () => {
  sendTrackingEvent({ ...trackingProperties,
    action: 'VIEW'
  });
};

// ----- Newsstand savings ----- //
const getMonthlyNewsStandPrice = (newsstand: number) => newsstand * 52 / 12;

const getNewsstandSaving = (subscriptionMonthlyCost: number, newsstandWeeklyCost: number) => fixDecimals(getMonthlyNewsStandPrice(newsstandWeeklyCost) - subscriptionMonthlyCost);

const getNewsstandSavingPercentage = (subscriptionMonthlyCost: number, newsstandWeeklyCost: number) => Math.floor(100 - subscriptionMonthlyCost / getMonthlyNewsStandPrice(newsstandWeeklyCost) * 100);

const getNewsstandPrice = (productOption: PaperProductOptions) => newsstandPrices[productOption];

// Paper product
const paperHasDeliveryEnabled = (): boolean => isTestSwitchedOn('paperHomeDeliveryEnabled');

// ----- Exports ----- //
export { sendTrackingEventsOnClick, sendTrackingEventsOnView, displayPrice, getProductPrice, getNewsstandSaving, getNewsstandSavingPercentage, getNewsstandPrice, fixDecimals, paperHasDeliveryEnabled, DigitalPack, PaperAndDigital, Paper, PremiumTier, DailyEdition, GuardianWeekly, isPhysicalProduct };