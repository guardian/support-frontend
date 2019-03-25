// @flow
import { Everyday, Weekend, Sunday } from 'helpers/productPrice/productOptions';
import type { PaperProductOptions } from 'helpers/productPrice/productOptions';


export const getTitle = (productOption: PaperProductOptions) => {
  switch (productOption) {
    case Everyday:
      return 'Every day';
    default:
      return productOption;
  }
};

export const getShortDescription = (productOption: PaperProductOptions): ?string => {
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
