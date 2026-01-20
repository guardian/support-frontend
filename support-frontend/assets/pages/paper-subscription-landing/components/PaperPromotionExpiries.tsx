import { getDateString } from 'helpers/utilities/dateFormatting';
import { useWindowWidth } from 'pages/aus-moment-map/hooks/useWindowWidth';
import type { PaperPromotion } from '../helpers/getPromotions';
import { getTitle } from '../helpers/products';
import {
	promotionContainer,
	promotionParagraph,
} from './PaperPromotionExpiriesStyles';

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
function getPromotionList(
	paperPromotions: PaperPromotion[],
	fromTablet: boolean,
): JSX.Element[] {
	const multiPromo = paperPromotions.length > 1;
	return paperPromotions.map((paperPromotion, index) =>
		fromTablet ? (
			<span>{getPromotion(paperPromotion, index, multiPromo)}</span>
		) : (
			<div>{getPromotion(paperPromotion, index, multiPromo)}</div>
		),
	);
}

type PaperPromoExpiriesProps = {
	paperPromotions: PaperPromotion[];
};
export default function PaperPromotionExpiries({
	paperPromotions,
}: PaperPromoExpiriesProps): JSX.Element {
	const { windowWidthIsGreaterThan } = useWindowWidth();
	return (
		<div css={promotionContainer}>
			<p css={promotionParagraph}>
				{getPromotionList(paperPromotions, windowWidthIsGreaterThan('tablet'))}
			</p>
		</div>
	);
}
