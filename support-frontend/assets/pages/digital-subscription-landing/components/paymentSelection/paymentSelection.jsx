// @flow

import React from 'react';
// components
import ProductOption, {
  type Product,
} from 'components/product/productOption';
import {
  getPaymentOptions,
  type PaymentSelectionPropTypes,
} from './helpers/paymentSelection';
// styles
import {
  paymentSelection,
  productOverride,
  productOverrideWithLabel,
} from './paymentSelectionStyles';

export type PropTypes = {
  paymentOptions: Product[],
}

function isAnnualOption(option: Product) {
  return option.title === 'Annual' || option.title === '12 months';
}

const PaymentSelection = ({ paymentOptions }: PropTypes) =>
// The following makes sure the Annual payment selection card is on the right hand side
  (
    <div css={paymentSelection}>
      {/* Spread operator because .sort is mutating */}
      {([...paymentOptions].sort((opt1, opt2) => {
          if (isAnnualOption(opt1)) {
            return 1;
          }
          if (isAnnualOption(opt2)) {
            return -1;
          }
          return 0;
        }).map(product => (
          <ProductOption
            cssOverrides={product.label ? productOverrideWithLabel : productOverride}
            title={product.title}
            price={product.price}
            offerCopy={product.offerCopy}
            priceCopy={product.priceCopy}
            buttonCopy={product.buttonCopy}
            href={product.href}
            onClick={product.onClick}
            onView={product.onView}
            label={product.label}
          />
        )))
      }
    </div>);

function DigitalPaymentSelection({
  countryGroupId,
  currencyId,
  productPrices,
  orderIsAGift,
}: PaymentSelectionPropTypes) {
  const paymentOptions = getPaymentOptions({
    countryGroupId,
    currencyId,
    productPrices,
    orderIsAGift,
  });

  return <PaymentSelection paymentOptions={paymentOptions} />;
}

export default DigitalPaymentSelection;
