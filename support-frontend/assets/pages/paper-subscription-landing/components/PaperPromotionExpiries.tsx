import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { PaperProductOptions } from '@modules/product/productOptions';
import { type ProductPrices } from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getDateString } from 'helpers/utilities/dateFormatting';
import type { PaperTsAndCsProps } from './PaperLandingTsAndCs';
import { promotionContainer } from './PaperPromotionExpiriesStyles';

function getPromotionExpiry(promotion?: Promotion): string {
	if (!promotion?.expires) {
		return '';
	}
	const expiryDate = new Date(promotion.expires);
	return `Offer ends ${getDateString(expiryDate)}. `;
}

function getFirstPromotion(
	paperFulfilment: PaperFulfilmentOptions,
	paperProduct: PaperProductOptions,
	productPrices: ProductPrices,
): string {
	const firstPromotion =
		productPrices['United Kingdom']?.[paperFulfilment]?.[paperProduct]?.Monthly
			?.GBP?.promotions?.[0];
	return getPromotionExpiry(firstPromotion);
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
	const promotionExpiryList = activePaperProducts
		.filter((paperOption) => paperOption.endsWith('Plus'))
		.map((paperOption) =>
			getFirstPromotion(paperFulfilment, paperOption, productPrices),
		)
		.filter((expiry) => expiry !== '');
	const uniquePromotionExpiryList =
		promotionExpiryList.length > 0
			? [...new Set(promotionExpiryList)]
			: promotionExpiryList;
	return displayPaperPromotionExpiries(uniquePromotionExpiryList);
}
