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
import {
  type Product,
} from 'components/product/productOption';

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

import { type PropTypes } from '../paymentSelection';

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
          <span className="product-option__price-detail">then {display(displayPrice)} per month</span>
        </span>
        :
        <span>
          <span className="product-option__price-detail">14 day free trial</span>
        </span>;
    },
    offer: '',
    label: '',
  },
  [Annual]: {
    title: 'Annual',
    salesCopy: (currencyId: IsoCurrency, displayPrice: number, promotionalPrice: Option<number>) => {
      const display = price => getDisplayPrice(currencyId, price);
      return isNumeric(promotionalPrice) ?
        <span>
          <span className="product-option__price-detail">then {display(displayPrice)} a year</span>
        </span>
        :
        <span>
          <span className="product-option__price-detail">per month</span>
        </span>;
    },
    offer: 'Save an additional 21%',
    label: 'Best Deal',
  },
};

const BILLING_PERIOD_GIFT = {
  [Quarterly]: {
    title: '3 months',
    salesCopy: () => (
      <span>
        <span className="product-option__price-detail">One-off payment</span>
      </span>),
    offer: '',
    label: '',
  },
  [Annual]: {
    title: '12 months',
    salesCopy: () => (
      <span>
        <span className="product-option__price-detail">One-off payment</span>
      </span>),
    offer: '',
    label: 'Best Deal',
  },
};

// export type Product = {
//   title: string,
//   price: string,
//   children?: Node,
//   offerCopy?: string,
//   priceCopy: Node,
//   buttonCopy: string,
//   href: string,
//   onClick: Function,
//   label?: string,
// }

// state
const mapStateToProps = (state: State): PropTypes => {
  const { productPrices, orderIsAGift } = state.page;
  const { countryGroupId, currencyId } = state.common.internationalisation;
  const productOptions = getProductOptions(productPrices, countryGroupId);

  const createPaymentOption = (billingPeriod: BillingPeriod): Product => {
    const digitalBillingPeriod = billingPeriod === 'Monthly' || billingPeriod === 'Annual' ? billingPeriod : 'Monthly';
    const digitalBillingPeriodGift = billingPeriod === 'Annual' || billingPeriod === 'Quarterly' ? billingPeriod : 'Quarterly';
    const billingPeriodForHref = orderIsAGift ? digitalBillingPeriodGift : digitalBillingPeriod;
    const productPrice = getProductPrice(productOptions, billingPeriod, currencyId);
    const fullPrice = productPrice.price;
    const promotion = getAppliedPromo(productPrice.promotions);
    const promoCode = promotion ? promotion.promoCode : null;
    const promotionalPrice = promotion && isNumeric(promotion.discountedPrice) ? promotion.discountedPrice : null;
    const offerCopy = promotion &&
    promotion.landingPage &&
    promotion.landingPage.roundel ? promotion.landingPage.roundel :
      BILLING_PERIOD[digitalBillingPeriod].offer;

    return orderIsAGift ?
      {
        title: BILLING_PERIOD_GIFT[digitalBillingPeriodGift].title,
        price: getDisplayPrice(currencyId, fullPrice),
        href: getDigitalCheckout(countryGroupId, billingPeriodForHref, promoCode, orderIsAGift),
        onClick: sendTrackingEventsOnClick('subscribe_now_cta_gift', 'DigitalPack', null, billingPeriod),
        priceCopy: BILLING_PERIOD_GIFT[digitalBillingPeriodGift].salesCopy(),
        offerCopy: '',
        label: BILLING_PERIOD_GIFT[digitalBillingPeriodGift].label,
        buttonCopy: 'Give this gift',
      } :
      {
        title: BILLING_PERIOD[digitalBillingPeriod].title,
        price: getDisplayPrice(currencyId, promotionalPrice || fullPrice),
        href: getDigitalCheckout(countryGroupId, billingPeriodForHref, promoCode, orderIsAGift),
        onClick: sendTrackingEventsOnClick('subscribe_now_cta', 'DigitalPack', null, billingPeriod),
        priceCopy: BILLING_PERIOD[digitalBillingPeriod].salesCopy(currencyId, fullPrice, promotionalPrice),
        offerCopy,
        label: BILLING_PERIOD[digitalBillingPeriod].label,
        buttonCopy: 'Start free trial',
      };

  };
  return {
    paymentOptions: Object.keys(productOptions).map(createPaymentOption),
  };
};

export {
  mapStateToProps,
};
