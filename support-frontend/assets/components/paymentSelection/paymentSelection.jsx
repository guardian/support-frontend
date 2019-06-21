// @flow

import React from 'react';
import { connect } from 'react-redux';

// components
import ProductOption, {
  ProductOptionContent,
  ProductOptionTitle,
  ProductOptionPrice, // this will be used in the next design version
  ProductOptionCopy, // this will be used in the next design version
  ProductOptionOffer,
  ProductOptionButton,
} from 'components/productOption/productOption';

// styles
import './paymentSelection.scss';

import { mapStateToProps } from './helpers/paymentSelection';

type PaymentOption = {|
  title: string,
  singlePeriod: string,
  price: string,
  href: string,
  onClick: () => void,
  salesCopy: string,
  offer: string,
|}

type PropTypes = {
  paymentOptions: Array<PaymentOption>;
}

const PaymentSelection = ({ paymentOptions }: PropTypes) => {

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
              {/* <ProductOptionPrice>
                {paymentOption.price}&nbsp;
                <ProductOptionCopy>/{paymentOption.singlePeriod}</ProductOptionCopy>
              </ProductOptionPrice> */}
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
