// @flow

import React from 'react';
import { connect } from 'react-redux';
// components
import ProductOption, {
  type Product,
} from 'components/product/productOption';
import {
  mapStateToProps,
} from './helpers/paymentSelection';
// styles
import {
  paymentSelection,
  paymentSelectionCard,
} from './paymentSelectionStyles';

export type PropTypes = {
  paymentOptions: Product[],
}

const PaymentSelection = ({ paymentOptions }: PropTypes) =>
// The following line makes sure the Annual payment selection card is on the right hand side

  (
    <div css={paymentSelection}>
      {([...paymentOptions].sort((opt1) => { // Spread operator because .sort is mutating
          if (opt1.title === 'Annual' || opt1.title === '12 months') {
            return 1;
          }
          return 0;
        }).map(product => (
          <div css={paymentSelectionCard}>
            <ProductOption
              title={product.title}
              price={product.price}
              offerCopy={product.offerCopy}
              priceCopy={product.priceCopy}
              buttonCopy={product.buttonCopy}
              href={product.href}
              onClick={product.onClick}
              label={product.label}
            />
          </div>
        )))
      }
    </div>);

export default connect(mapStateToProps)(PaymentSelection);
