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
import {
  paymentSelection,
  paymentSelectionCard,
  productOptionLabel,
} from './paymentSelectionStyles';

type PropTypes = {
  paymentOptions: Array<PaymentOption>,
  orderIsAGift: boolean,
}

const PaymentSelection = ({ paymentOptions, orderIsAGift }: PropTypes) =>
// The following line makes sure the Annual payment selection card is on the right hand side

  (
    <div css={paymentSelection}>
      {([...paymentOptions].sort((opt1) => { // Spread operator because .sort is mutating
          if (opt1.title === 'Annual') {
            return 1;
          }
          return -1;
        }).map(paymentOption => (
          <div css={paymentSelectionCard}>
            <span css={productOptionLabel}>
              {paymentOption.label}
            </span>
            <ProductOption>
              <ProductOptionContent>
                <ProductOptionTitle>{paymentOption.title}</ProductOptionTitle>
                <ProductOptionOffer>
                  {paymentOption.offer}
                </ProductOptionOffer>
              </ProductOptionContent>
              <ProductOptionButton
                href={paymentOption.href}
                onClick={paymentOption.onClick}
                aria-label="Subscribe-button"
                salesCopy={paymentOption.salesCopy}
              >
                {orderIsAGift ? 'Give this gift' : 'Start free trial now'}
              </ProductOptionButton>
            </ProductOption>
          </div>
        )))
      }
    </div>);
export default connect(mapStateToProps)(PaymentSelection);
