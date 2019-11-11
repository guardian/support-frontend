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

type PropTypes = {
  paymentOptions: Array<PaymentOption>,
}

const PaymentSelection = ({ paymentOptions }: PropTypes) => (
  <div className="payment-selection">
    {
        (paymentOptions.map(paymentOption => (
          <div className="payment-selection__card payment-selection__card">
            <span className="product-option__label product-option__label">
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
                {'Start free trial now'}
              </ProductOptionButton>
            </ProductOption>
          </div>
        )))
      }
  </div>
);


export default connect(mapStateToProps)(PaymentSelection);
