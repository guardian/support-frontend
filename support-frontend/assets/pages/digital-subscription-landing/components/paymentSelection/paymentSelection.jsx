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
import { mapStateToProps } from './helpers/paymentSelection';
import { type PaymentOption } from './helpers/paymentSelection';

// styles
import './paymentSelection.scss';

type PropTypes = {
  paymentOptions: Array<PaymentOption>,
  dailyEditionsVariant: boolean,
}

const PaymentSelection = ({ paymentOptions, dailyEditionsVariant }: PropTypes) => (
  <div className="payment-selection">
    {
        (paymentOptions.map(paymentOption => (
          <div className={dailyEditionsVariant ? 'payment-selection__card payment-selection__card--A' : 'payment-selection__card'}>
            <span className={dailyEditionsVariant ? 'product-option__label product-option__label--A' : 'product-option__label'}>
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
