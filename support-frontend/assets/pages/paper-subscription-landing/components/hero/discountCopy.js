// @flow

const discountCopy: DiscountCopy =  {
    roundel: ['Save up to', '52%', 'for a year'],
    heading: 'Save up to 52% for a year on The Guardian and The Observer',
    offer: [
      'Save 37% a month on retail price',
      'Save 33% a month on retail price',
      'Save 25% a month on retail price',
      'Save 22% a month on retail price',
    ],
  };

type DiscountCopy = {|
  roundel: string[],
  heading: string,
  offer: string[],
|}

export const getDiscountCopy = (): DiscountCopy => discountCopy;
