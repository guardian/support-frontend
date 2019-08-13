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
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

export const getProductOptions = (productPrices: ProductPrices, countryGroupId: CountryGroupId) => (
  productPrices[countryGroups[countryGroupId].name].NoFulfilmentOptions.NoProductOptions
);

export const getCurrencySymbol = (currencyId: IsoCurrency): string => currencies[currencyId].glyph;

const getDisplayPrice = (currencyId, price) => getCurrencySymbol(currencyId) + fixDecimals(price);

const getProductPrice = (productOptions, billingPeriodTitle, currencyId) => (
  productOptions[billingPeriodTitle][currencyId].price
);

const getSavingPercentage = (annualCost, annualizedMonthlyCost) => `${Math.round((1 - (annualCost / annualizedMonthlyCost)) * 100)}%`;

const BILLING_PERIOD = {
  [Monthly]: {
    title: 'Monthly',
    singlePeriod: 'month',
    salesCopy: (displayPrice: string, saving?: string) => ({
      control: () => (
        <span>14 day free trial, then <strong>{displayPrice}</strong> {saving && null} a month
          <br className="product-option__full-screen-break" />
          <br className="product-option__full-screen-break" />
        </span>
      ),
      variantA: () => (
        <span>
          14 day free trial, then <strong>{displayPrice}</strong> {saving && null} a month
          <br className="product-option__full-screen-break" />
          <br className="product-option__full-screen-break" />
        </span>
      ),
    }
    ),
  },
  [Annual]: {
    title: 'Annual',
    singlePeriod: 'year',
    salesCopy: (displayPrice: string, saving?: string) => ({
      control: () => (
        <span>
          14 day free trial, then <strong>{displayPrice}</strong>
          &nbsp;for the first year (save <strong>{saving}</strong> per year)
        </span>
      ),
      variantA: () => (
        <span>
          14 day free trial, then <strong>{displayPrice}</strong>
          &nbsp;for the first year (save <strong>{saving}</strong> per year)
        </span>
      ),
    }
    ),
  },
};

export type PaymentOption = {
  title: string,
  singlePeriod: string,
  href: string,
  salesCopy: { control: () => Element<'span'>, variantA: () => Element<'span'>},
  offer: Option<string>,
  price: Option<string>,
  onClick: Function,
}

// state
const mapStateToProps = (state: State): { paymentOptions: Array<PaymentOption> } => {
  const { productPrices } = state.page;
  const { countryGroupId, currencyId } = state.common.internationalisation;

  /*
  * NoFulfilmentOptions - means there this nothing to be delivered
  * NoProductOptions   - means there is only one product to choose
  */
  const productOptions = getProductOptions(productPrices, countryGroupId);
  const annualizedMonthlyCost = getProductPrice(productOptions, 'Monthly', currencyId) * 12;
  const annualCost = getProductPrice(productOptions, 'Annual', currencyId);
  const saving = getDisplayPrice(currencyId, annualizedMonthlyCost - annualCost);
  const offer = getSavingPercentage(annualCost, annualizedMonthlyCost);

  const paymentOptions: Array<PaymentOption> = Object.keys(productOptions).map((productTitle: BillingPeriod) => {

    const billingPeriodTitle = productTitle === 'Monthly' || productTitle === 'Annual' ? productTitle : 'Monthly';
    const displayPrice = getDisplayPrice(currencyId, getProductPrice(productOptions, billingPeriodTitle, currencyId));

    return {
      title: BILLING_PERIOD[billingPeriodTitle].title,
      singlePeriod: BILLING_PERIOD[billingPeriodTitle].singlePeriod,
      price: displayPrice,
      href: getDigitalCheckout(countryGroupId, billingPeriodTitle),
      onClick: sendTrackingEventsOnClick('subscribe_now_cta', 'DigitalPack', null, billingPeriodTitle),
      salesCopy: BILLING_PERIOD[billingPeriodTitle].salesCopy(displayPrice, saving),
      offer,
    };

  });

  return {
    paymentOptions,
  };
};

export {
  mapStateToProps,
};
