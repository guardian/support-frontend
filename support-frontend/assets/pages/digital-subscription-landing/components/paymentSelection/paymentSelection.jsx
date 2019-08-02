// @flow

import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

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
  dailyEditionsVariant: boolean,
}

const PaymentSelection = ({ paymentOptions, dailyEditionsVariant }: PropTypes) => {
  const variantCopy = dailyEditionsVariant ? 'variantA' : 'control';

  return (
    <div className="payment-selection">
      {
        (paymentOptions.map(paymentOption => (
          <div className={cx('payment-selection__card', { 'payment-selection__card--variantA-width': dailyEditionsVariant })}>
            <ProductOption
              href={paymentOption.href}
              onClick={paymentOption.onClick}
              dailyEditionsVariant={dailyEditionsVariant}
            >
              <ProductOptionContent>
                <ProductOptionTitle>{paymentOption.title}</ProductOptionTitle>
                <ProductOptionOffer
                  dailyEditionsVariant={dailyEditionsVariant}
                  hidden={paymentOption.title === 'Monthly'}
                >
                    Save {paymentOption.offer}
                </ProductOptionOffer>
              </ProductOptionContent>
              <ProductOptionButton
                href={paymentOption.href}
                onClick={paymentOption.onClick}
                aria-label="Subscribe-button"
                salesCopy={paymentOption.salesCopy[variantCopy]()}
                dailyEditionsVariant={dailyEditionsVariant}
              >
                {dailyEditionsVariant ? 'Start free trial now' : 'Subscribe now' }
              </ProductOptionButton>
            </ProductOption>
          </div>
        )))
      }
      <p className="payment-selection_cancel-text">You can cancel your subscription at any time</p>
    </div>
  );
};

export default connect(mapStateToProps)(PaymentSelection);
