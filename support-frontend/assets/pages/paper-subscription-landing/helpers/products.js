// @flow
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { Everyday, Sixday, Sunday, Weekend } from 'helpers/productPrice/productOptions';


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

export const getShortDescription = (productOption: ProductOptions): ?string => {
  switch (productOption) {
    case Everyday:
    case Weekend:
      return 'The Guardian + The Observer';
    case Sunday:
      return 'The Observer';
    default:
      return null;
  }
};
