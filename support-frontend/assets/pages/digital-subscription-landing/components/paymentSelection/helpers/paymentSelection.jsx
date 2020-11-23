// @flow
import React from 'react';
import type { Element } from 'react';

// helpers
import { getDigitalCheckout } from 'helpers/externalLinks';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { currencies } from 'helpers/internationalisation/currency';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { fixDecimals } from 'helpers/subscriptions';

// types
import { type BillingPeriod, Annual, Monthly, Quarterly } from 'helpers/billingPeriods';
import { type State } from 'pages/digital-subscription-landing/digitalSubscriptionLandingReducer';
import { type Option } from 'helpers/types/option';
import type {
  ProductPrices,
  BillingPeriods,
  ProductPrice,
} from 'helpers/productPrice/productPrices';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { getAppliedPromo } from 'helpers/productPrice/promotions';
import { isNumeric } from 'helpers/productPrice/productPrices';

export type PaymentOption = {
  title: string,
  href: string,
  salesCopy: Element<'span'>,
  offer: Option<string>,
  onClick: Function,
  label: Option<string>,
}

export const getProductOptions = (productPrices: ProductPrices, countryGroupId: CountryGroupId) => (
  productPrices[countryGroups[countryGroupId].name].NoFulfilmentOptions.NoProductOptions
);

export const getCurrencySymbol = (currencyId: IsoCurrency): string => currencies[currencyId].glyph;

export const getDisplayPrice = (currencyId: IsoCurrency, price: number) =>
  getCurrencySymbol(currencyId) + fixDecimals(price);

export const getProductPrice = (
  productOptions: BillingPeriods,
  billingPeriod: BillingPeriod,
  currencyId: IsoCurrency,
): ProductPrice => (
  productOptions[billingPeriod][currencyId]
);

export const getSavingPercentage = (annualCost: number, monthlyCostAnnualized: number) => `${Math.round((1 - (annualCost / monthlyCostAnnualized)) * 100)}%`;

const BILLING_PERIOD = {
  [Monthly]: {
    title: 'Monthly',
    salesCopy: (currencyId: IsoCurrency, displayPrice: number, promotionalPrice: Option<number>) => {
      const display = price => getDisplayPrice(currencyId, price);
      return promotionalPrice ?
        <span>
          <span className="product-option__price">{display(promotionalPrice)}</span>
          <span className="product-option__price-detail">then {display(displayPrice)} per month</span>
        </span>
        :
        <span>
          <span className="product-option__price">{display(displayPrice)}</span>
          <span className="product-option__price-detail">14 day free trial</span>
        </span>;
    },
    offer: null,
    label: null,
  },
  [Annual]: {
    title: 'Annual',
    salesCopy: (currencyId: IsoCurrency, displayPrice: number, promotionalPrice: Option<number>) => {
      const display = price => getDisplayPrice(currencyId, price);
      return isNumeric(promotionalPrice) ?
        <span>
          <span className="product-option__price">{display(promotionalPrice)}</span>
          <span className="product-option__price-detail">then {display(displayPrice)} a year</span>
        </span>
        :
        <span>
          <span className="product-option__price">{display(displayPrice)}</span>
          <span className="product-option__price-detail">{display(displayPrice / 12)} per month</span>
        </span>;
    },
    offer: 'Save an additional 21%',
    label: 'Best Deal',
  },
};

const BILLING_PERIOD_GIFT = {
  [Quarterly]: {
    title: '3 months',
    salesCopy: (currencyId: IsoCurrency, displayPrice: number) => {
      const display = price => getDisplayPrice(currencyId, price);
      return (
        <span>
          <span className="product-option__price">{display(displayPrice)}</span>
          <span className="product-option__price-detail">One-off payment</span>
        </span>);
    },
    offer: null,
    label: null,
  },
  [Annual]: {
    title: '12 months',
    salesCopy: (
      currencyId: IsoCurrency,
      displayPrice: number,
    ) => {
      const display = price => getDisplayPrice(currencyId, price);
      return (
        <span>
          <span className="product-option__price">{display(displayPrice)}</span>
          <span className="product-option__price-detail">One-off payment</span>
        </span>);
    },
    offer: null,
    label: null,
  },
};

// state
const mapStateToProps = (state: State): { paymentOptions: Array<PaymentOption> } => {
  const { productPrices, orderIsAGift } = state.page;
  const { countryGroupId, currencyId } = state.common.internationalisation;
  const productOptions = getProductOptions(productPrices, countryGroupId);

  const createPaymentOption = (billingPeriod: BillingPeriod): PaymentOption => {
    const digitalBillingPeriod = billingPeriod === 'Monthly' || billingPeriod === 'Annual' ? billingPeriod : 'Monthly';
    const digitalBillingPeriodGift = billingPeriod === 'Annual' || billingPeriod === 'Quarterly' ? billingPeriod : 'Quarterly';
    const billingPeriodForHref = orderIsAGift ? digitalBillingPeriodGift : digitalBillingPeriod;
    const productPrice = getProductPrice(productOptions, billingPeriod, currencyId);
    const fullPrice = productPrice.price;
    const promotion = getAppliedPromo(productPrice.promotions);
    const promoCode = promotion ? promotion.promoCode : null;
    const promotionalPrice = promotion && isNumeric(promotion.discountedPrice) ? promotion.discountedPrice : null;
    const offer = promotion &&
    promotion.landingPage &&
    promotion.landingPage.roundel ? promotion.landingPage.roundel :
      BILLING_PERIOD[digitalBillingPeriod].offer;

    return orderIsAGift ?
      {
        title: BILLING_PERIOD_GIFT[digitalBillingPeriodGift].title,
        href: getDigitalCheckout(countryGroupId, billingPeriodForHref, promoCode, orderIsAGift),
        onClick: sendTrackingEventsOnClick('subscribe_now_cta_gift', 'DigitalPack', null, billingPeriod),
        salesCopy: BILLING_PERIOD_GIFT[digitalBillingPeriodGift].salesCopy(currencyId, fullPrice),
        offer: null,
        label: BILLING_PERIOD_GIFT[digitalBillingPeriodGift].label,
      } :
      {
        title: BILLING_PERIOD[digitalBillingPeriod].title,
        href: getDigitalCheckout(countryGroupId, billingPeriodForHref, promoCode, orderIsAGift),
        onClick: sendTrackingEventsOnClick('subscribe_now_cta', 'DigitalPack', null, billingPeriod),
        salesCopy: BILLING_PERIOD[digitalBillingPeriod].salesCopy(currencyId, fullPrice, promotionalPrice),
        offer,
        label: BILLING_PERIOD[digitalBillingPeriod].label,
      };

  };
  const paymentOptions: Array<PaymentOption> = Object.keys(productOptions).map(createPaymentOption);
  return {
    paymentOptions,
  };
};

export {
  mapStateToProps,
};
