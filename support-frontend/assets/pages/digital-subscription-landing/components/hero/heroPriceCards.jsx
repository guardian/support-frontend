// @flow

// ----- Imports ----- //

import React from 'react';
import { css } from '@emotion/core';
import { brand } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';

import ProductOptionSmall from 'components/product/productOptionSmall';

const priceCardContainer = css`
  border-left: 1px solid ${brand[600]};
  padding: 0 ${space[5]}px;
  margin: ${space[5]}px 0;
`;

const product1 = {
  offerCopy: '50% off for 3 months',
  priceCopy: 'You\'ll pay £5.99/month for 3 months, then £11.99 per month',
  href: '',
  buttonCopy: 'Subscribe monthly for £5.99',
  onClick: () => {},
  onView: () => {},
};

const product2 = {
  offerCopy: 'Save 20% against monthly in the first year',
  priceCopy: 'You\'ll pay £99 for 1 year, then £119 per year',
  href: '',
  buttonCopy: 'Subscribe annually for £99',
  onClick: () => {},
  onView: () => {},
};


export function HeroPriceCards() {
  return (
    <div css={priceCardContainer}>
      <ProductOptionSmall {...product1} />
      <ProductOptionSmall {...product2} />
    </div>
  );
}
