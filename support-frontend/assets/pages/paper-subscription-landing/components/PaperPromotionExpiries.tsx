import { getDateString } from 'helpers/utilities/dateFormatting';
import type { PaperPromotion } from '../helpers/getPromotions';
import { getTitle } from '../helpers/products';
import { promotionContainer } from './PaperPromotionExpiriesStyles';

function getPromotionProductsAndExpiry(paperPromotion: PaperPromotion): string {
	const products = paperPromotion.activePaperProducts
		.map((paperProduct) => getTitle(paperProduct))
		.join(', ');
	const offerExpiry = paperPromotion.expires
		? ` offer ends ${getDateString(new Date(paperPromotion.expires))}. `
		: '';
	return `${products}${offerExpiry}`;
}

type PaperPromoExpiriesProps = {
	paperPromotions: PaperPromotion[];
};
export default function PaperPromotionExpiries({
	paperPromotions,
}: PaperPromoExpiriesProps): JSX.Element {
	return (
		<div css={promotionContainer}>
			{paperPromotions.map((paperPromotion, index) => (
				<p>{`${'*'.repeat(index + 1)} ${getPromotionProductsAndExpiry(
					paperPromotion,
				)}`}</p>
			))}
		</div>
	);
}
