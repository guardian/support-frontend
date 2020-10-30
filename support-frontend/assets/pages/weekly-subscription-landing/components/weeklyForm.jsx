// @flow
import React from 'react';
import { connect } from 'react-redux';

import {
  SixWeekly,
  billingPeriodTitle,
  weeklyBillingPeriods,
  type WeeklyBillingPeriod,
} from 'helpers/billingPeriods';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

import Prices, { type PropTypes } from './content/Prices';

import { type State } from '../weeklySubscriptionLandingReducer';
import { getProductPrice } from 'helpers/productPrice/productPrices';
import {
  getAppliedPromoDescription,
  getPriceDescription,
} from 'helpers/productPrice/priceDescriptions';
import { getWeeklyFulfilmentOption } from 'helpers/productPrice/fulfilmentOptions';
import { getOrigin, getQueryParameter } from 'helpers/url';
import { promoQueryParam } from 'helpers/productPrice/promotions';

// ---- Plans ----- //

const getCheckoutUrl = (billingPeriod: WeeklyBillingPeriod, orderIsGift: boolean): string => {
  const promoCode = getQueryParameter(promoQueryParam);
  const promoQuery = promoCode ? `&${promoQueryParam}=${promoCode}` : '';
  const gift = orderIsGift ? '/gift' : '';
  return `${getOrigin()}/subscribe/weekly/checkout${gift}?period=${billingPeriod.toString()}${promoQuery}`;
};

// ----- State/Props Maps ----- //

/**
 * export type PaymentOption = {
  title: string,
  href: string,
  salesCopy: Element<'span'>,
  offer: Option<string>,
  onClick: Function,
  label: Option<string>,
}
 *
 */

const mapStateToProps = (state: State): PropTypes => {
  const { countryId } = state.common.internationalisation;
  const { productPrices, orderIsAGift } = state.page;
  const billingPeriodsToUse = weeklyBillingPeriods.filter(billingPeriod =>
    !(state.page.orderIsAGift && billingPeriod === SixWeekly));

  return {
    paymentOptions: billingPeriodsToUse.map((billingPeriod) => {
      const productPrice = productPrices ? getProductPrice(
        productPrices,
        countryId,
        billingPeriod,
        getWeeklyFulfilmentOption(countryId),
      ) : { price: 0, fixedTerm: false, currency: 'GBP' };
      return {
        title: billingPeriodTitle(billingPeriod, orderIsAGift),
        href: getCheckoutUrl(billingPeriod, orderIsAGift),
        salesCopy: (
          <span>
            {getPriceDescription(
              productPrice,
              billingPeriod,
            )}
          </span>),
        offer: getAppliedPromoDescription(billingPeriod, productPrice),
        onClick: sendTrackingEventsOnClick(`subscribe_now_cta-${billingPeriod}`, 'GuardianWeekly', null),
        label: 'hmm?',
        // price: null,
        // saving: null,
      };
    }),

    // plans: billingPeriodsToUse.reduce((plans, billingPeriod) => {

    //   return {
    //     ...plans,
    //     [billingPeriod]: {
    //       title: billingPeriodTitle(billingPeriod, orderIsAGift),
    //       copy: getPriceDescription(
    //         productPrice,
    //         billingPeriod,
    //       ),
    //       offer: getAppliedPromoDescription(billingPeriod, productPrice),
    //       href: getCheckoutUrl(billingPeriod, orderIsAGift),
    //       onClick: sendTrackingEventsOnClick(`subscribe_now_cta-${billingPeriod}`, 'GuardianWeekly', null),
    //       price: null,
    //       saving: null,
    //     },
    //   };
    // }, {}),
    // theme: 'dark',
  };
};


// ----- Exports ----- //

export default connect(mapStateToProps)(Prices);
