// @flow

import React, { type Node } from 'react';

import { flashSaleIsActive, getSaleCopy } from 'helpers/flashSale';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

export type DiscountCopy = {
  roundel: string[],
  heading: string | Node,
};

const discountCopy = (discountPercentage: number): DiscountCopy => (
  discountPercentage > 0 ?
    {
      roundel: ['Save up to', `${discountPercentage}%`, 'a year'],
      heading: [`Save up to ${discountPercentage}% for a year on The Guardian`, <br />, ' and The Observer'],
    } :
    {
      roundel: [],
      heading: 'Save money with a subscription',
    }
);

export const getDiscountCopy = (discountPercentage: number): DiscountCopy => {
  if (flashSaleIsActive('Paper', GBPCountries)) {
    const saleCopy = getSaleCopy('Paper', GBPCountries);
    return saleCopy.landingPage;
  }
  return discountCopy(discountPercentage);
};
