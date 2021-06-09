// @flow
import React, { type Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  sendTrackingEventsOnClick,
  sendTrackingEventsOnView,
} from 'helpers/productPrice/subscriptions';
import {
  finalPrice, getProductPrice,
} from 'helpers/productPrice/paperProductPrices';

import { type State } from '../paperSubscriptionLandingPageReducer';
import { setTab, type TabActions } from '../paperSubscriptionLandingPageActions';

import { type Product } from 'components/product/productOption';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { ActivePaperProductTypes } from 'helpers/productPrice/productOptions';
import { paperCheckoutUrl } from 'helpers/urls/routes';
import { getTitle } from '../helpers/products';
import type { ProductPrice, ProductPrices } from 'helpers/productPrice/productPrices';
import { showPrice } from 'helpers/productPrice/productPrices';
import { getAppliedPromo } from 'helpers/productPrice/promotions';

import Prices from './content/prices';

// ---- Helpers ----- //

const getPriceCopyString = (price: ProductPrice, productCopy: Node = null): Node => {
  const promotion = getAppliedPromo(price.promotions);
  if (promotion && promotion.numberOfDiscountedPeriods) {
    return <>per month for {promotion.numberOfDiscountedPeriods} months{productCopy}, then {showPrice(price)} after</>;
  }
  return <>per month{productCopy}</>;
};

const getOfferText = (price: ProductPrice) => {
  if (price.savingVsRetail && price.savingVsRetail > 0) {
    return `Save ${price.savingVsRetail}% on retail price`;
  }
  return '';
};

// ---- Plans ----- //
const copy = {
  HomeDelivery: {
    Everyday: <> for <strong>Guardian</strong> and <strong>Observer</strong>, delivered</>,
    Sixday: <> for <strong>Guardian</strong>, delivered</>,
    Weekend: <> for <strong>Guardian</strong> and <strong>Observer</strong>, delivered</>,
    Sunday: <> for <strong>Observer</strong>, delivered</>,
  },
  Collection: {
    Everyday: <> for <strong>Guardian</strong> and <strong>Observer</strong></>,
    Sixday: <> for <strong>Guardian</strong></>,
    Weekend: <> for <strong>Guardian</strong> and <strong>Observer</strong></>,
    Sunday: <> for <strong>Observer</strong></>,
  },
};


const getPlans = (
  fulfilmentOption: PaperFulfilmentOptions,
  productPrices: ProductPrices,
) =>
  ActivePaperProductTypes.map((productOption) => {
    const priceAfterPromosApplied = finalPrice(productPrices, fulfilmentOption, productOption);
    const promotion = getAppliedPromo(priceAfterPromosApplied.promotions);
    const promoCode = promotion ? promotion.promoCode : null;
    const trackingProperties = {
      id: `subscribe_now_cta-${[productOption, fulfilmentOption].join()}`,
      product: 'Paper',
      componentType: 'ACQUISITIONS_BUTTON',
    };
    const nonDiscountedPrice = getProductPrice(
      productPrices,
      fulfilmentOption,
      productOption,
    );

    return {
      title: getTitle(productOption),
      price: showPrice(priceAfterPromosApplied),
      href: paperCheckoutUrl(fulfilmentOption, productOption, promoCode),
      onClick: sendTrackingEventsOnClick(trackingProperties),
      onView: sendTrackingEventsOnView(trackingProperties),
      buttonCopy: 'Subscribe now',
      priceCopy: getPriceCopyString(nonDiscountedPrice, copy[fulfilmentOption][productOption]),
      offerCopy: getOfferText(priceAfterPromosApplied),
      label: '',
    };
  });


// ----- State/Props Maps ----- //
type StateProps = {|
  activeTab: PaperFulfilmentOptions,
  products: Product[],
|}

const mapStateToProps = (state: State): StateProps => ({
  activeTab: state.page.tab,
  products: state.page.productPrices ? getPlans(state.page.tab, state.page.productPrices) : [],
});

const mapDispatchToProps = (dispatch: Dispatch<TabActions>) =>
  ({
    setTabAction: bindActionCreators(setTab, dispatch),
  });

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(Prices);
