// @flow
import React from 'react';
import type { Element } from 'react';

// helpers
import { getDigitalCheckout } from 'helpers/externalLinks';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { currencies } from 'helpers/internationalisation/currency';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { type State } from 'pages/digital-subscription-landing/digitalSubscriptionLandingReducer';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { Annual, Monthly } from 'helpers/billingPeriods';
import { type Option } from 'helpers/types/option';

const BILLING_PERIOD = {
  [Monthly]: {
    title: 'Monthly',
    singlePeriod: 'month',
    salesCopy: (displayPrice: string, saving?: string) => (
      <span>14 day free trial, then
        &nbsp;<strong>{displayPrice}</strong> a month for 12 months {saving}
        <br className="product-option__full-screen-break" />
      </span>
    ),
  },
  [Annual]: {
    title: 'Annually',
    singlePeriod: 'year',
    salesCopy: (displayPrice: string, saving?: string) => (
      <span>
        14 day free trial, then <strong>{displayPrice}</strong>
        &nbsp;for the first year<br />
        (save <strong>{saving}</strong> per year)
      </span>
    ),
  },
};

export type PaymentOption = {
  title: string,
  singlePeriod: string,
  href: string,
  salesCopy: (displayPrice: string, saving?: string) => any,
  offer: Option<string>,
  price: Option<string>,
  onClick: Function,
}

// state
const mapStateToProps = (state: State): { paymentOptions: Array<PaymentOption> } => {
  const { productPrices } = state.page;
  const { countryGroupId, currencyId } = state.common.internationalisation;
  // console.log({ currencyId });

  /*
  * NoFulfilmentOptions - means there this nothing to be delivered
  * NoProductOptions ? - means there is only one product to choose
  */
  const productOptions = productPrices[countryGroups[countryGroupId].name].NoFulfilmentOptions.NoProductOptions;
  const annualizedMonthlyCost = productOptions.Monthly[currencyId].price * 12;
  const annualCost = productOptions.Annual[currencyId].price;
  const saving = currencies[currencyId].glyph + (annualizedMonthlyCost - annualCost).toFixed(2);
  const offer = `${Math.round((1 - (annualCost / annualizedMonthlyCost)) * 100)}%`;

  const paymentOptions = Object.keys(productOptions).map((productTitle: BillingPeriod) => {
    const billingPeriodTitle = productTitle === 'Monthly' || productTitle === 'Annual' ? productTitle : 'Monthly';

    const displayPrice = currencies[currencyId].glyph + productOptions[billingPeriodTitle][currencyId].price.toFixed(2);

    return {
      ...BILLING_PERIOD[billingPeriodTitle],
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
