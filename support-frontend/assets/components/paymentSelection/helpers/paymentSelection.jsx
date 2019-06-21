// @flow
import React from 'react';
import type { Node, Element } from 'react';

// helpers
import { getDigitalCheckout } from 'helpers/externalLinks';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { currencies } from 'helpers/internationalisation/currency';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { type State } from './../../../pages/digital-subscription-landing/digitalSubscriptionLandingReducer';
import type { DigitalBillingPeriod } from 'helpers/billingPeriods';
import { Annual, Monthly } from 'helpers/billingPeriods';
import { type Option } from 'helpers/types/option';

const BILLING_PERIOD = {
  [Monthly]: {
    title: 'Monthly',
    singlePeriod: 'month',
    salesCopy: (displayPrice: string, saving?: string) => (
      <span>14 day free trial, then <strong>{displayPrice}</strong> a month for 12 months {saving}</span>
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

type PaymentOption = {
  title: string,
  singlePeriod: string,
  salesCopy: Element<'span'>,
  offer: Option<string>,
  price: Option<string>,
  href: string,
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

  const paymentOptions = Object.keys(productOptions).map((productTitle: DigitalBillingPeriod) => {

    console.log(typeof productTitle);
    const displayPrice = currencies[currencyId].glyph + productOptions[productTitle][currencyId].price.toFixed(2);

    return {
      ...BILLING_PERIOD[productTitle],
      price: displayPrice,
      href: getDigitalCheckout(countryGroupId, productTitle),
      onClick: sendTrackingEventsOnClick('subscribe_now_cta', 'DigitalPack', null, productTitle),
      salesCopy: BILLING_PERIOD[productTitle].salesCopy(displayPrice, saving),
      offer,
    };

  });
  console.log({ paymentOptions });
  return {
    paymentOptions,
  };
};

export {
  mapStateToProps,
};
