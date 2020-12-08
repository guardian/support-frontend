// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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

import { type State } from '../../paperSubscriptionLandingPageReducer';
import { setTab, type TabActions } from '../../paperSubscriptionLandingPageActions';

import { type Product } from 'components/product/productOption';
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

import PaperPriceCopy from './paperPriceCopy';
import Prices from './prices';

// ---- Helpers ----- //

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

const getOfferText = (price: ProductPrice, productOption: PaperProductOptions) => {
  if (flashSaleIsActive(Paper)) {
    return getOfferStr(price.price, getNewsstandPrice(productOption));
  }
  if (price.savingVsRetail && price.savingVsRetail > 0) {
    return `Save ${price.savingVsRetail}% on retail price`;
  }
  return '';
};

// ---- Plans ----- //
const copy = {
  Everyday: 'Guardian and Observer papers',
  Sixday: 'Guardian papers',
  Weekend: 'Saturday Guardian + Observer papers',
  Sunday: 'Observer paper',
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
      offerCopy: <PaperPriceCopy saving={getOfferText(price, productOption)} copy={copy[productOption]} />,
      label: '',
    };
  });


// ----- State/Props Maps ----- //
type StateProps = {|
  activeTab: PaperFulfilmentOptions,
  products: Product[],
  useDigitalVoucher: boolean
|}

const mapStateToProps = (state: State): StateProps => ({
  activeTab: state.page.tab,
  products: state.page.productPrices ? getPlans(state.page.tab, state.page.productPrices) : [],
  useDigitalVoucher: state.common.settings.useDigitalVoucher || false,
});

const mapDispatchToProps = (dispatch: Dispatch<TabActions>) =>
  ({
    setTabAction: bindActionCreators(setTab, dispatch),
  });

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(Prices);
