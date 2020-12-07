// @flow
import React from 'react';
import { connect } from 'react-redux';

import { type Option } from 'helpers/types/option';
import {
  getNewsstandPrice,
  getNewsstandSaving,
  getNewsstandSavingPercentage,
  sendTrackingEventsOnClick,
} from 'helpers/subscriptions';
import {
  finalPrice,
} from 'helpers/productPrice/paperProductPrices';
// import ProductPagePlanForm, { type PropTypes } from 'components/productPage/productPagePlanForm/productPagePlanForm';

import { type State } from '../../paperSubscriptionLandingPageReducer';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type {
  PaperProductOptions,
} from 'helpers/productPrice/productOptions';
import { ActivePaperProductTypes } from 'helpers/productPrice/productOptions';
import { paperCheckoutUrl } from 'helpers/routes';
import { getTitle } from '../../helpers/products';
import type { ProductPrice, ProductPrices } from 'helpers/productPrice/productPrices';
import { showPrice } from 'helpers/productPrice/productPrices';
import { getAppliedPromo } from 'helpers/productPrice/promotions';
import { flashSaleIsActive } from 'helpers/flashSale';
import { Paper } from 'helpers/subscriptions';

import Prices, { type PropTypes } from './prices';

// ---- Helpers ----- //

// const getPriceStr = (price: ProductPrice): string => {
//   const promotion = getAppliedPromo(price.promotions);
//   if (promotion && promotion.numberOfDiscountedPeriods) {
//     // $FlowIgnore - we have checked numberOfDiscountedPeriods is not null above
//     return `${showPrice(price)} a month for ${promotion.numberOfDiscountedPeriods} months`;
//   }
//   return showPrice(price);
// };

const getOfferStr = (subscription: Option<number>, newsstand: Option<number>): string => {
  if ((subscription && newsstand && parseFloat(getNewsstandSaving(subscription, newsstand)) > 0)) {
    return `Save ${getNewsstandSavingPercentage(subscription, newsstand)}% a month on retail price`;
  }
  return '';
};

const getPriceCopyString = (price: ProductPrice): string => {
  const promotion = getAppliedPromo(price.promotions);
  if (promotion && promotion.numberOfDiscountedPeriods) {
    return `per month for ${promotion.numberOfDiscountedPeriods} months`;
  }
  return 'per month';
};

// const getSavingStr = (price: ProductPrice): string => {
//   const promotionApplied = getAppliedPromo(price.promotions);
//   if (promotionApplied) {
//     return `${showPrice(price)} a month thereafter`;
//   }
//   return '';
// };


// ---- Plans ----- //
const copy = {
  HomeDelivery: {
    Everyday: 'Guardian and Observer papers, delivered',
    Sixday: 'Guardian papers, delivered',
    Weekend: 'Saturday Guardian and Observer papers, delivered',
    Sunday: 'Observer paper, delivered',
  },
  Collection: {
    Everyday: 'Guardian and Observer papers',
    Sixday: 'Guardian papers',
    Weekend: 'Saturday Guardian and Observer papers',
    Sunday: 'Observer paper',
  },
};

const getOfferText = (price: ProductPrice, productOption: PaperProductOptions) => {
  if (flashSaleIsActive(Paper)) {
    return getOfferStr(price.price, getNewsstandPrice(productOption));
  }
  if (price.savingVsRetail && price.savingVsRetail > 0) {
    return `Save ${price.savingVsRetail}% on retail price`;
  }
  return '';
};

const getPlans = (
  fulfilmentOption: PaperFulfilmentOptions,
  productPrices: ProductPrices,
) =>
  ActivePaperProductTypes.map((productOption) => {
    const price = finalPrice(productPrices, fulfilmentOption, productOption);
    const promotion = getAppliedPromo(price.promotions);
    const promoCode = promotion ? promotion.promoCode : null;

    return {
      title: getTitle(productOption),
      price: showPrice(price),
      href: paperCheckoutUrl(fulfilmentOption, productOption, promoCode),
      onClick: sendTrackingEventsOnClick(
        'subscribe_now_cta',
        'Paper',
        null,
        [productOption, fulfilmentOption].join(),
      ),
      buttonCopy: 'Subscribe now',
      priceCopy: getPriceCopyString(price),
      offerCopy: <p>{getOfferText(price, productOption)}<br />{copy[fulfilmentOption][productOption]}</p>,
      label: '',
    };
  });


// ----- State/Props Maps ----- //
const mapStateToProps = (state: State): PropTypes => ({
  products: state.page.productPrices ? getPlans(state.page.tab, state.page.productPrices) : [],
});

// ----- Exports ----- //

export default connect(mapStateToProps)(Prices);
