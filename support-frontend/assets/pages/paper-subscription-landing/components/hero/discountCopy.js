// @flow

import { flashSaleIsActive, getSaleCopy } from 'helpers/flashSale';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

type DiscountCopy = {
  roundel: string[],
  heading: string,
};

const discountCopy: DiscountCopy = {
  roundel: ['Save up to', '37%', 'for a year'],
  heading: 'Save up to 37% for a year on The Guardian and The Observer',
};

export const getDiscountCopy = (): DiscountCopy => {
  if (flashSaleIsActive('Paper', GBPCountries)) {
    const saleCopy = getSaleCopy('Paper', GBPCountries);
    return saleCopy.landingPage;
  }
  return discountCopy;
};
