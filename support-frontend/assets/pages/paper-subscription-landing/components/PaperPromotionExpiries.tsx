import { getDateString } from 'helpers/utilities/dateFormatting';
import type { PaperPromotion } from '../helpers/getPromotions';
import type { PaperTsAndCsProps } from './PaperLandingTsAndCs';
import { promotionContainer } from './PaperPromotionExpiriesStyles';

function getPromoProductsAndExpiry(paperPromo?: PaperPromotion): string {
	if (!paperPromo?.expires) {
		return '';
	}
	const products = paperPromo.activePaperProducts
		.map((paperProduct) => paperProduct.replace('Plus', ''))
		.join(', ');
	return `${products} ${getPromoExpiry(paperPromo)}`;
}
function getPromoExpiry(paperPromo?: PaperPromotion): string {
	if (!paperPromo?.expires) {
		return '';
	}
	const expiryDate = new Date(paperPromo.expires);
	return `Offer ends ${getDateString(expiryDate)}. `;
}

function displayPaperPromotionExpiries(
	paperPromos?: PaperPromotion[],
): JSX.Element {
	const multiPaperPromotions = paperPromos ? paperPromos.length > 1 : 0;
	return paperPromos && paperPromos.length > 0 ? (
		<div css={promotionContainer}>
			<p>
				{paperPromos.map((paperPromo, index) => (
					<div key={index}>
						{'*'.repeat(index + 1)}{' '}
						{multiPaperPromotions
							? getPromoProductsAndExpiry(paperPromo)
							: getPromoExpiry(paperPromo)}
					</div>
				))}
			</p>
		</div>
	) : (
		<></>
	);
}

export default function PaperPromotionExpiries({
	paperPromotions,
}: PaperTsAndCsProps): JSX.Element {
	return displayPaperPromotionExpiries(paperPromotions);
}
