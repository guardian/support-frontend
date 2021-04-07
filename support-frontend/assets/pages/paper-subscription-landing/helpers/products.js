// @flow
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { Everyday, Sixday } from 'helpers/productPrice/productOptions';


export const getTitle = (productOption: ProductOptions) => {
  switch (productOption) {
    case Sixday:
      return 'Six day';
    case Everyday:
      return 'Every day';
    default:
      return productOption;
  }
};

