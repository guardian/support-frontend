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
  getPriceDescription,
} from 'helpers/productPrice/priceDescriptions';
import { getWeeklyFulfilmentOption } from 'helpers/productPrice/fulfilmentOptions';
import { getOrigin, getQueryParameter } from 'helpers/url';
import { promoQueryParam, type Promotion } from 'helpers/productPrice/promotions';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { currencies } from 'helpers/internationalisation/currency';
import { fixDecimals } from 'helpers/subscriptions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';


const getCheckoutUrl = (billingPeriod: WeeklyBillingPeriod, orderIsGift: boolean): string => {
  const promoCode = getQueryParameter(promoQueryParam);
  const promoQuery = promoCode ? `&${promoQueryParam}=${promoCode}` : '';
  const gift = orderIsGift ? '/gift' : '';
  return `${getOrigin()}/subscribe/weekly/checkout${gift}?period=${billingPeriod.toString()}${promoQuery}`;
};

const getCurrencySymbol = (currencyId: IsoCurrency): string => currencies[currencyId].glyph;

const getPriceWithSymbol = (currencyId: IsoCurrency, price: number) =>
  getCurrencySymbol(currencyId) + fixDecimals(price);

const getPromotionLabel = (promotion: Promotion | null) => {
  if (!promotion || !promotion.discount) { return null; }
  return `Save ${promotion.discount.amount}%`;
};

const getRelevantPromotion = ({ promotions }: ProductPrice) => {
  if (promotions && promotions.length) {
    return promotions[0];
  }
  return null;
};

const mapStateToProps = (state: State): PropTypes => {
  const { countryId } = state.common.internationalisation;
  const { productPrices, orderIsAGift } = state.page;
  const billingPeriodsToUse = weeklyBillingPeriods.filter(billingPeriod =>
    !(state.page.orderIsAGift && billingPeriod === SixWeekly));

  return {
    products: billingPeriodsToUse.map((billingPeriod) => {
      const productPrice = productPrices ? getProductPrice(
        productPrices,
        countryId,
        billingPeriod,
        getWeeklyFulfilmentOption(countryId),
      ) : { price: 0, fixedTerm: false, currency: 'GBP' };
      const promotion = getRelevantPromotion(productPrice);
      const mainDisplayPrice = promotion && promotion.discountedPrice ? promotion.discountedPrice : productPrice.price;
      return {
        title: billingPeriodTitle(billingPeriod, orderIsAGift),
        price: getPriceWithSymbol(productPrice.currency, mainDisplayPrice),
        priceCopy: (
          <span>
            {getPriceDescription(
              productPrice,
              billingPeriod,
            )}
          </span>),
        buttonCopy: 'Subscribe now',
        href: getCheckoutUrl(billingPeriod, orderIsAGift),
        label: getPromotionLabel(promotion) || '',
        onClick: sendTrackingEventsOnClick(`subscribe_now_cta-${billingPeriod}`, 'GuardianWeekly', null),
      };
    }),
  };
};


// ----- Exports ----- //

export default connect(mapStateToProps)(Prices);
