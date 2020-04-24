// @flow
import React from 'react';
import type { Element } from 'react';

// helpers
import { getDigitalCheckout } from 'helpers/externalLinks';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { currencies } from 'helpers/internationalisation/currency';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { Annual, Monthly } from 'helpers/billingPeriods';
import { fixDecimals } from 'helpers/subscriptions';

// types
import { type State } from 'pages/digital-subscription-landing/digitalSubscriptionLandingReducer';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { type Option } from 'helpers/types/option';
import type {
  ProductPrices,
  BillingPeriods,
  ProductPrice,
} from 'helpers/productPrice/productPrices';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { DigitalBillingPeriod } from 'helpers/billingPeriods';
import { promoQueryParam } from 'helpers/productPrice/promotions';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getQueryParameter } from 'helpers/url';
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
  billingPeriod: DigitalBillingPeriod,
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
          <span className="product-option__price-detail">then {display(displayPrice)}/month</span>
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
          <span className="product-option__price-detail">then {display(displayPrice)}/year</span>
        </span>
        :
        <span>
          <span className="product-option__price">{display(displayPrice)}</span>
          <span className="product-option__price-detail">{display(displayPrice / 12)}/month</span>
        </span>;
    },
    offer: 'Save an additional 21%',
    label: 'Best Deal',
  },
};

const matchesQueryParam = promotion =>
  getQueryParameter(promoQueryParam) === promotion.promoCode;
const matchesABVariant = (promotion: Promotion, abVariant: Option<string>) => {
  if (!abVariant) {
    return false;
  }

  if (abVariant === 'one-for-one') {
    return promotion.promoCode.toLowerCase() === 'one-for-one';
  }

  return promotion.promoCode === 'DK0NT24WG';
};

// When the 'one for one vs 3 months' ab test is complete this function can
// be deleted and we can use the getAppliedPromo function from promotions.js
function getPromotion(promotions: ?Promotion[], abVariant: string): Option<Promotion> {
  if (promotions && promotions.length > 0) {
    if (promotions.length > 1) {
      return promotions.find(matchesQueryParam) ||
        promotions.find(promotion => matchesABVariant(promotion, abVariant)) ||
        promotions[0];
    }
    return promotions[0];
  }
  return null;
}

// state
const mapStateToProps = (state: State): { paymentOptions: Array<PaymentOption> } => {
  const { productPrices } = state.page;
  const { countryGroupId, currencyId } = state.common.internationalisation;
  const productOptions = getProductOptions(productPrices, countryGroupId);

  const createPaymentOption = (billingPeriod: BillingPeriod): PaymentOption => {
    const digitalBillingPeriod = billingPeriod === 'Monthly' || billingPeriod === 'Annual' ? billingPeriod : 'Monthly';

    const productPrice = getProductPrice(productOptions, digitalBillingPeriod, currencyId);
    const fullPrice = productPrice.price;
    const promotion = getPromotion(productPrice.promotions, state.common.abParticipations.digitalPackMonthlyOfferTest);
    const promoCode = promotion ? promotion.promoCode : null;
    const promotionalPrice = promotion && isNumeric(promotion.discountedPrice) ? promotion.discountedPrice : null;
    const offer = promotion &&
    promotion.landingPage &&
    promotion.landingPage.roundel ? promotion.landingPage.roundel :
      BILLING_PERIOD[digitalBillingPeriod].offer;

    return {
      title: BILLING_PERIOD[digitalBillingPeriod].title,
      href: getDigitalCheckout(countryGroupId, digitalBillingPeriod, promoCode),
      onClick: sendTrackingEventsOnClick('subscribe_now_cta', 'DigitalPack', null, digitalBillingPeriod),
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
