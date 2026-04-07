import { getDateString } from 'helpers/utilities/dateFormatting';
import type { PaperPromotion } from './getPromotions';

export default function getNewspaperPromoTerms(
	promotion: PaperPromotion,
): string {
	if (!promotion.expires) {
		return '';
	}
	return `* Retail saving shown is the retail saving during the first six months. Offer ends ${getDateString(
		new Date(promotion.expires),
	)}`;
}
