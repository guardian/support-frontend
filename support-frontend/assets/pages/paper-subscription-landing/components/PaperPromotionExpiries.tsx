import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { PaperProductOptions } from '@modules/product/productOptions';
import { type ProductPrices } from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getDateString } from 'helpers/utilities/dateFormatting';
import type { PaperTsAndCsProps } from './PaperLandingTsAndCs';
import { promotionContainer } from './PaperPromotionExpiriesStyles';

const promoCodeDivider = '~';

function getPromoCodeExpiry(promotion?: Promotion): string {
	if (!promotion?.expires) {
		return '';
	}
	const expiryDate = new Date(promotion.expires);
	return `${promotion.promoCode}${promoCodeDivider}Offer ends ${getDateString(
		expiryDate,
	)}. `;
}

function getFirstPromotion(
	paperFulfilment: PaperFulfilmentOptions,
	paperProduct: PaperProductOptions,
	productPrices: ProductPrices,
): string {
	// first promotion would be shown on price card, we match this here
	const firstPromotion =
		productPrices['United Kingdom']?.[paperFulfilment]?.[paperProduct]?.Monthly
			?.GBP?.promotions?.[0];
	return getPromoCodeExpiry(firstPromotion);
}

function displayPaperPromotionExpiries(
	uniquePromotionExpiryList: string[],
): JSX.Element {
	return uniquePromotionExpiryList.length > 0 ? (
		<div css={promotionContainer}>
			<p>
				{uniquePromotionExpiryList.map((expiry, index) => (
					<div key={index}>
						{'*'.repeat(index + 1)}
						{expiry}
					</div>
				))}
			</p>
		</div>
	) : (
		<></>
	);
}

export default function PaperPromotionExpiries({
	paperFulfilment,
	productPrices,
	activePaperProducts,
}: PaperTsAndCsProps): JSX.Element {
	const promoCodeExpiries = activePaperProducts
		.filter((paperOption) => paperOption.endsWith('Plus'))
		.map((paperOption) =>
			getFirstPromotion(paperFulfilment, paperOption, productPrices),
		)
		.filter((expiry) => expiry !== '');
	const uniquePromoCodeExpiries =
		promoCodeExpiries.length > 0
			? [...new Set(promoCodeExpiries)]
			: promoCodeExpiries;
	const uniqueExpiries = uniquePromoCodeExpiries.map((promo) =>
		promo.substring(promo.lastIndexOf(promoCodeDivider) + 1),
	);
	return displayPaperPromotionExpiries(uniqueExpiries);
}
