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
  paymentOptions: Array<PaymentOption>;
}

const PaymentSelection = ({ paymentOptions }: PropTypes) => {
  console.log(paymentOptions);
  return (
    <div className="payment-selection">
      {paymentOptions.map(paymentOption => (
        <div className="payment-selection__card">
          <ProductOption
            href={paymentOption.href}
            onClick={paymentOption.onClick}
          >
            <ProductOptionContent>
              <ProductOptionTitle>{paymentOption.title}</ProductOptionTitle>
              <ProductOptionOffer hidden={paymentOption.title === 'Monthly'} >Save {paymentOption.offer}</ProductOptionOffer>
            </ProductOptionContent>
            <ProductOptionButton
              href={paymentOption.href}
              onClick={paymentOption.onClick}
              aria-label="Subscribe-button"
              salesCopy={paymentOption.salesCopy}
            >
              Subscribe now
            </ProductOptionButton>
          </ProductOption>
        </div>
      ))}
    </div>
  );
};

export default connect(mapStateToProps)(PaymentSelection);
