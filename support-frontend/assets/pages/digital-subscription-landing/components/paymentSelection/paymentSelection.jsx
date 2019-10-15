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
import { type Option } from 'helpers/types/option';

// styles
import './paymentSelection.scss';

type PropTypes = {
  paymentOptions: Array<PaymentOption>,
  pageType: Option<string>,
}

const PaymentSelection = ({ paymentOptions, pageType }: PropTypes) => (
  <div className="payment-selection">
    {
        (paymentOptions.map(paymentOption => (
          <div className={pageType === 'A' ? 'payment-selection__card payment-selection__card--A' : 'payment-selection__card'}>
            <span className={pageType === 'A' ? 'product-option__label product-option__label--A' : 'product-option__label'}>
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
