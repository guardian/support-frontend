// @flow
import React from 'react';
import type { Node } from 'react';

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
    salesCopy: (displayPrice: string, saving?: string): Node => (
      <span>14 day free trial, then <strong>{displayPrice}</strong> a month for 12 months {saving}</span>
    ),
  },
  [Annual]: {
    title: 'Annually',
    singlePeriod: 'year',
    salesCopy: (displayPrice: string, saving?: string): Node => (
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
  salesCopy: Function,
  offer: Option<string>,
  price: Option<string>,
  onClick?: Option<() => void>,
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
    let billingTitle = '';
    if (productTitle === 'Monthly' || productTitle === 'Annual') {
      billingTitle = productTitle;
    } else {
      billingTitle = 'Monthly';
    }

    const displayPrice = currencies[currencyId].glyph + productOptions[billingTitle][currencyId].price.toFixed(2);

    return {
      ...BILLING_PERIOD[billingTitle],
      price: displayPrice,
      href: getDigitalCheckout(countryGroupId, billingTitle),
      onClick: sendTrackingEventsOnClick('subscribe_now_cta', 'DigitalPack', null, billingTitle),
      salesCopy: BILLING_PERIOD[billingTitle].salesCopy(displayPrice, saving),
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
