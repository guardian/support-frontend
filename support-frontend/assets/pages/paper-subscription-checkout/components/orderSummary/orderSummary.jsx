// @flow

import React from 'react';
import { connect } from 'react-redux';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import OrderSummary from 'components/orderSummary/orderSummary';
import OrderSummaryProduct from 'components/orderSummary/orderSummaryProduct';

import { paperProductsWithoutDigital, type ProductOptions } from 'helpers/productPrice/productOptions';
import { Collection, type FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ActivePaperProducts } from 'helpers/productPrice/productOptions';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getProductPrice } from 'helpers/productPrice/paperProductPrices';

import { showPrice, type ProductPrices, type ProductPrice } from 'helpers/productPrice/productPrices';
import {
  billingPeriodNoun,
  type BillingPeriod,
} from 'helpers/billingPeriods';

import { getOrderSummaryTitle } from 'pages/paper-subscription-checkout/helpers/orderSummaryText';

type PropTypes = {
  fulfilmentOption: FulfilmentOptions,
  productOption: ActivePaperProducts,
  billingPeriod: BillingPeriod,
  productPrices: ProductPrices,
  useDigitalVoucher: boolean,
  image: $Call<GridImageType, GridImg>,
  includesDigiSub: boolean,
  changeSubscription?: string | null,
  startDate?: string,
  total: ProductPrice,
};

function getMobileSummaryTitle(
  productOption: ProductOptions,
  fulfilmentOption: FulfilmentOptions,
  useDigitalVoucher: ?boolean = false,
  includesDigiSub: ?boolean = false,
) {
  return (<>
    {getOrderSummaryTitle(productOption, fulfilmentOption, useDigitalVoucher)}
    {includesDigiSub && <> +&nbsp;Digital</>}
  </>);
}

function getPriceSummary(price: string, billingPeriod: BillingPeriod) {
  return `${price}/${billingPeriodNoun(billingPeriod).toLowerCase()}`;
}

function sensiblyGenerateDigiSubPrice(totalPrice: ProductPrice, paperPrice: ProductPrice): ProductPrice {
  const total = totalPrice.price;
  const paper = paperPrice.price;
  const digiSubPrice = ((total * 100) - (paper * 100)) / 100;

  return {
    ...totalPrice,
    price: digiSubPrice,
  };
}

function mapStateToProps(state: WithDeliveryCheckoutState) {
  return {
    fulfilmentOption: state.page.checkout.fulfilmentOption,
    productOption: state.page.checkout.productOption,
    billingPeriod: state.page.checkout.billingPeriod,
    productPrices: state.page.checkout.productPrices,
    useDigitalVoucher: state.common.settings.useDigitalVoucher,
    total: getProductPrice(
      state.page.checkout.productPrices,
      state.page.checkout.fulfilmentOption,
      state.page.checkout.productOption,
    ),
  };
}

function PaperOrderSummary(props: PropTypes) {
  const total = getPriceSummary(showPrice(props.total, false), props.billingPeriod);
  // If the user has added a digi sub, we need to know the price of their selected base paper product separately
  const basePaperPrice = props.includesDigiSub ?
    getProductPrice(props.productPrices, props.fulfilmentOption, paperProductsWithoutDigital[props.productOption])
    : props.total;
  const digitalCost = sensiblyGenerateDigiSubPrice(props.total, basePaperPrice);

  const productInfoHomeDelivery = [
    {
      content: `You'll pay ${getPriceSummary(showPrice(basePaperPrice, false), props.billingPeriod)}`,
    },
  ];
  const productInfoSubsCard = [
    ...productInfoHomeDelivery,
    {
      content: props.startDate ? `Your first payment will be on ${props.startDate}` : '',
      subText: 'Your subscription card will arrive in the post before the payment date',
    },
  ];
  const productInfoPaper = props.fulfilmentOption === Collection ? productInfoSubsCard : productInfoHomeDelivery;

  const productInfoDigiSub = [
    {
      content: `You'll pay ${getPriceSummary(showPrice(digitalCost, false), props.billingPeriod)}`,
    },
  ];

  const mobileSummary = {
    title: getMobileSummaryTitle(
      props.productOption,
      props.fulfilmentOption,
      props.useDigitalVoucher,
      props.includesDigiSub,
    ),
    price: total,
  };

  return (
    <OrderSummary
      image={props.image}
      changeSubscription={props.changeSubscription}
      total={total}
      mobileSummary={mobileSummary}
    >
      <OrderSummaryProduct
        productName={getOrderSummaryTitle(props.productOption, props.fulfilmentOption, props.useDigitalVoucher)}
        productInfo={productInfoPaper}
      />
      {props.includesDigiSub && <OrderSummaryProduct
        productName="Digital subscription"
        productInfo={productInfoDigiSub}
      />}
    </OrderSummary>
  );
}

PaperOrderSummary.defaultProps = {
  changeSubscription: '',
  startDate: '',
};

export default connect(mapStateToProps)(PaperOrderSummary);
