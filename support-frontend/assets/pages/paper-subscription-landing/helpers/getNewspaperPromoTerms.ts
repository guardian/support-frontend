import type { Promotion } from 'helpers/productPrice/promotions';
import { getDateString } from 'helpers/utilities/dateFormatting';

const numberString = [
	'zero',
	'one',
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight',
	'nine',
	'ten',
	'eleven',
	'twelve',
];

export default function getNewspaperPromoTerms(promotion: Promotion): string {
	const { durationMonths } = promotion.discount ?? {};
	if (!promotion.expires || !durationMonths) {
		return '';
	}
	return `* Retail saving shown is the retail saving during the first ${
		numberString[durationMonths]
	} months. Offer ends ${getDateString(new Date(promotion.expires))}.`;
}
