import type { Option } from 'helpers/types/option';
import 'helpers/types/option';

export type DiscountCopy = {
	roundel: string[];
	heading: Option<string>;
};

const discountCopy = (discountPercentage: number): DiscountCopy =>
	discountPercentage > 0
		? {
				roundel: ['Save up to', `${discountPercentage}%`, 'a year'],
				heading: `Save up to ${discountPercentage}% a year with a subscription`,
		  }
		: {
				roundel: [],
				heading: 'Save money with a subscription',
		  };

export const getDiscountCopy = (discountPercentage: number): DiscountCopy =>
	discountCopy(discountPercentage);
