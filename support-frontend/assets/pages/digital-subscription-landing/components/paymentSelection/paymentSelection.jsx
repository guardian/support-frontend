// @flow

import React from 'react';
import { connect } from 'react-redux';
// components
import ProductOption, {
  ProductOptionButton,
  ProductOptionContent,
  ProductOptionOffer,
  ProductOptionTitle,
} from 'components/productOption/productOption';
import {
  mapStateToProps,
  type PaymentOption,
} from './helpers/paymentSelection';
// styles
import './paymentSelection.scss';
import { Annual } from 'helpers/billingPeriods';

type PropTypes = {
  paymentOptions: Array<PaymentOption>,
  orderIsAGift: boolean,
}

const PaymentSelection = ({ paymentOptions, orderIsAGift }: PropTypes) => {
  // The following line makes sure the Annual payment selection card is on the right hand side
  const paymentOptionsList = paymentOptions[0].title === Annual ?
    [paymentOptions[1], paymentOptions[0]] :
    paymentOptions;
  return (
    <div className="payment-selection">
      {
        (paymentOptionsList.map(paymentOption => (
          <div className="payment-selection__card">
            <span className="product-option__label">
              {paymentOption.label}
            </span>
            <ProductOption>
              <ProductOptionContent>
                <ProductOptionTitle>{paymentOption.title}</ProductOptionTitle>
                <ProductOptionOffer
                  hidden={!paymentOption.offer}
                >
                  {paymentOption.offer}
                </ProductOptionOffer>
              </ProductOptionContent>
              <ProductOptionButton
                href={paymentOption.href}
                onClick={paymentOption.onClick}
                aria-label="Subscribe-button"
                salesCopy={paymentOption.salesCopy}
              >
                {orderIsAGift ? 'Buy gift subscription' : 'Start free trial now'}
              </ProductOptionButton>
            </ProductOption>
          </div>
        )))
      }
    </div>);
};


export default connect(mapStateToProps)(PaymentSelection);
