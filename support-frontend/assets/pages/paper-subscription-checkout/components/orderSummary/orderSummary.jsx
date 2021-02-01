// @flow

import React from 'react';
import { connect } from 'react-redux';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import OrderSummary from 'components/orderSummary/orderSummary';
import OrderSummaryProduct from 'components/orderSummary/orderSummaryProduct';

import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ActivePaperProducts } from 'helpers/productPrice/productOptions';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getProductPrice } from 'helpers/productPrice/paperProductPrices';
import { showPrice } from 'helpers/productPrice/productPrices';

import { getOrderSummaryTitle } from '../../helpers/orderSummaryText';

type PropTypes = {
  fulfilmentOption: FulfilmentOptions,
  productOption: ActivePaperProducts,
  useDigitalVoucher: boolean,
  image: $Call<GridImageType, GridImg>,
  includesDigiSub: boolean,
  changeSubscription?: string | null,
  total: string,
};

function getMobileSummaryTitle(
  productOption: ProductOptions,
  fulfilmentOption: FulfilmentOptions,
  useDigitalVoucher: ?boolean = false,
  includesDigiSub: ?boolean = false,
) {
  return `${getOrderSummaryTitle(productOption, fulfilmentOption, useDigitalVoucher)}${includesDigiSub ? ' + Digital' : ''}`;
}

function mapStateToProps(state: WithDeliveryCheckoutState) {
  return {
    fulfilmentOption: state.page.checkout.fulfilmentOption,
    productOption: state.page.checkout.productOption,
    useDigitalVoucher: state.common.settings.useDigitalVoucher,
    total: showPrice(getProductPrice(
      state.page.checkout.productPrices,
      state.page.checkout.fulfilmentOption,
      state.page.checkout.productOption,
    ), false),
  };
}

function PaperOrderSummary(props: PropTypes) {
  const productInfoPaper = [
    {
      mainText: 'You\'ll pay £57.99/month',
    },
    {
      mainText: 'Your first payment will be on 04 February 2021',
      subText: 'Your subscription card will arrive in the post before the payment date',
    },
  ];

  const productInfoDigiSub = [
    {
      mainText: 'You\'ll pay £5/month',
    },
  ];

  const mobileSummary = {
    title: getMobileSummaryTitle(
      props.productOption,
      props.fulfilmentOption,
      props.useDigitalVoucher,
      props.includesDigiSub,
    ),
    price: props.total,
  };

  return (
    <OrderSummary
      image={props.image}
      changeSubscription={props.changeSubscription}
      total="£62.99/month"
      mobileSummary={mobileSummary}
    >
      <OrderSummaryProduct
        productName="Sixday paper"
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
};

export default connect(mapStateToProps)(PaperOrderSummary);
