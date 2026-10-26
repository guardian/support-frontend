import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
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

export default function getNewspaperPromoTerms(
	promotion: PromoWithCatalogInformation,
): string {
	const { durationMonths } = promotion.discount ?? {};
	if (!promotion.endTimestamp || !durationMonths) {
		return '';
	}
	return `* Retail saving shown is the retail saving during the first ${
		numberString[durationMonths]
	} months. Offer ends ${getDateString(new Date(promotion.endTimestamp))}.`;
}
