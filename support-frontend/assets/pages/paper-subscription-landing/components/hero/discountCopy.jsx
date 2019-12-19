// @flow

import React, { type Node } from 'react';

import { flashSaleIsActive, getSaleCopy } from 'helpers/flashSale';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

type DiscountCopy = {
  roundel: string[],
  heading: string | Node,
};

const discountCopy: DiscountCopy = {
  roundel: ['Save up to', '37%', 'for a year'],
  heading: <span>Save up to 37% for a year on The Guardian<br />and The Observer</span>,
};

export const getDiscountCopy = (): DiscountCopy => {
  if (flashSaleIsActive('Paper', GBPCountries)) {
    const saleCopy = getSaleCopy('Paper', GBPCountries);
    return saleCopy.landingPage;
  }
  return discountCopy;
};
