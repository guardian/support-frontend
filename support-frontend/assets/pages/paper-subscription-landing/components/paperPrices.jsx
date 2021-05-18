// @flow
import React, { type Node } from 'react';

import { type Option } from 'helpers/types/option';
import {
  getNewsstandPrice,
  getNewsstandSaving,
  getNewsstandSavingPercentage,
  sendTrackingEventsOnClick,
  sendTrackingEventsOnView,
} from 'helpers/subscriptions';
import {
  finalPrice,
} from 'helpers/productPrice/paperProductPrices';

import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type {
  PaperProductOptions,
} from 'helpers/productPrice/productOptions';
import { ActivePaperProductTypes } from 'helpers/productPrice/productOptions';
import { paperCheckoutUrl } from 'helpers/routes';
import { getTitle } from '../helpers/products';
import type { ProductPrice, ProductPrices } from 'helpers/productPrice/productPrices';
import { showPrice } from 'helpers/productPrice/productPrices';
import { getAppliedPromo } from 'helpers/productPrice/promotions';
import { flashSaleIsActive } from 'helpers/flashSale';
import { Paper } from 'helpers/subscriptions';

import Prices from './content/prices';

// ---- Helpers ----- //

const getOfferStr = (subscription: Option<number>, newsstand: Option<number>): string => {
  if ((subscription && newsstand && parseFloat(getNewsstandSaving(subscription, newsstand)) > 0)) {
    return `Save ${getNewsstandSavingPercentage(subscription, newsstand)}% a month on retail price`;
  }
  return '';
};

const getPriceCopyString = (price: ProductPrice, productCopy: Node = null): Node => {
  const promotion = getAppliedPromo(price.promotions);
  if (promotion && promotion.numberOfDiscountedPeriods) {
    return <>per month for {promotion.numberOfDiscountedPeriods} months{productCopy}</>;
  }
  return <>per month{productCopy}</>;
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
    const price = finalPrice(productPrices, fulfilmentOption, productOption);
    const promotion = getAppliedPromo(price.promotions);
    const promoCode = promotion ? promotion.promoCode : null;
    const trackingProperties = {
      id: `subscribe_now_cta-${[productOption, fulfilmentOption].join()}`,
      product: 'Paper',
      componentType: 'ACQUISITIONS_BUTTON',
    };

    return {
      title: getTitle(productOption),
      price: showPrice(price),
      href: paperCheckoutUrl(fulfilmentOption, productOption, promoCode),
      onClick: sendTrackingEventsOnClick(trackingProperties),
      onView: sendTrackingEventsOnView(trackingProperties),
      buttonCopy: 'Subscribe now',
      priceCopy: getPriceCopyString(price, copy[fulfilmentOption][productOption]),
      offerCopy: getOfferText(price, productOption),
      label: '',
    };
  });

  type PaperProductPricesProps ={|
  productPrices: ?ProductPrices,
  tab: PaperFulfilmentOptions,
  setTabAction: (PaperFulfilmentOptions) => void
|}

function PaperProductPrices({ productPrices, tab, setTabAction }: PaperProductPricesProps) {
  if (!productPrices) {
    return null;
  }
  const products = getPlans(tab, productPrices);

  return <Prices activeTab={tab} products={products} setTabAction={setTabAction} />;
}

// ----- Exports ----- //

export default PaperProductPrices;
