import { getDateString } from 'helpers/utilities/dateFormatting';
import type { PaperPromotion } from '../helpers/getPromotions';
import { promotionContainer } from './PaperPromotionExpiriesStyles';

function getPromoProductsAndExpiry(paperPromotion: PaperPromotion): string {
	const products = paperPromotion.activePaperProducts
		.map((paperProduct) => paperProduct.replace('Plus', ''))
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

type PaperPromoExpiriesProps = {
	paperPromotions: PaperPromotion[];
};
export default function PaperPromotionExpiries({
	paperPromotions,
}: PaperPromoExpiriesProps): JSX.Element {
	return (
		<div css={promotionContainer}>
			<p>
				{paperPromotions.map((paperPromotion, index) => (
					<div key={index}>
						{'*'.repeat(index + 1)}{' '}
						{paperPromotions.length > 1
							? getPromoProductsAndExpiry(paperPromotion)
							: getPromoExpiry(paperPromotion)}
					</div>
				))}
			</p>
		</div>
	);
}
