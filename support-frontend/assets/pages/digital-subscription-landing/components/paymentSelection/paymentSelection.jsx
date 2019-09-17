// @flow

import React from 'react';
import { connect } from 'react-redux';

// components
import ProductOption, {
  ProductOptionContent,
  ProductOptionTitle,
  ProductOptionOffer,
  ProductOptionButton,
} from 'components/productOption/productOption';

// styles
import './paymentSelection.scss';

import { mapStateToProps } from './helpers/paymentSelection';
import { type PaymentOption } from './helpers/paymentSelection';

type PropTypes = {
  paymentOptions: Array<PaymentOption>,
}

const PaymentSelection = ({ paymentOptions }: PropTypes) => (
  <div className="payment-selection">
    {
        (paymentOptions.map(paymentOption => (
          <div className="payment-selection__card">
            <span className="product-option__label">{paymentOption.label}</span>
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
    <p className="payment-selection_cancel-text">You can cancel your subscription at any time</p>
  </div>
);

export default connect(mapStateToProps)(PaymentSelection);
