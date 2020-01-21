// @flow

import { type Node } from 'react';

import { flashSaleIsActive, getSaleCopy } from 'helpers/flashSale';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

type DiscountCopy = {
  roundel: string[],
  heading: string | Node,
};

const discountCopy: DiscountCopy = {
  roundel: ['Save up to', '37%', 'a year'],
  heading: 'Save up to 37% a year with a subscription',
};

export const getDiscountCopy = (): DiscountCopy => {
  if (flashSaleIsActive('Paper', GBPCountries)) {
    const saleCopy = getSaleCopy('Paper', GBPCountries);
    return saleCopy.landingPage;
  }
  return discountCopy;
};
