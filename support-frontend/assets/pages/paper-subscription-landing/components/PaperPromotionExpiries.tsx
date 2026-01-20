import { getDateString } from 'helpers/utilities/dateFormatting';
import type { PaperPromotion } from '../helpers/getPromotions';
import { getTitle } from '../helpers/products';
import { promotionContainer } from './PaperPromotionExpiriesStyles';

function getPromoProductsAndExpiry(paperPromotion: PaperPromotion): string {
	const products = paperPromotion.activePaperProducts
		.map((paperProduct) => getTitle(paperProduct))
		.join(', ');
	const expiry = getPromoExpiry(paperPromotion);
	return `${products} ${expiry.charAt(0).toLowerCase() + expiry.slice(1)}`;
}
function getPromoExpiry(paperPromotion: PaperPromotion): string {
	if (!paperPromotion.expires) {
		return '';
	}
	const expiryDate = new Date(paperPromotion.expires);
	return `Offer ends ${getDateString(expiryDate)}. `;
}

function getPromotion(
	paperPromotion: PaperPromotion,
	index: number,
	multiPromo: boolean,
): string {
	const star = '*'.repeat(index + 1);
	const promoText = multiPromo
		? getPromoProductsAndExpiry(paperPromotion)
		: getPromoExpiry(paperPromotion);
	return `${star} ${promoText}`;
}

type PaperPromoExpiriesProps = {
	paperPromotions: PaperPromotion[];
};
export default function PaperPromotionExpiries({
	paperPromotions,
}: PaperPromoExpiriesProps): JSX.Element {
	const multiPromo = paperPromotions.length > 1;
	return (
		<div css={promotionContainer}>
			{paperPromotions.map((paperPromotion, index) => (
				<p>{getPromotion(paperPromotion, index, multiPromo)}</p>
			))}
		</div>
	);
}
