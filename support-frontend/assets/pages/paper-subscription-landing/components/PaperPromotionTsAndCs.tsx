import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { PaperProductOptions } from '@modules/product/productOptions';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import { type ProductPrices } from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getDateString } from 'helpers/utilities/dateFormatting';
import type { PaperTsAndCsProps } from './PaperLandingTsAndCs';
import { promotionContainer } from './PaperPromotionStyles';

function getPromotionExpiry(promotion: Promotion): string {
	const expiryDate = promotion.expires
		? new Date(promotion.expires)
		: undefined;
	return expiryDate ? `Offer ends ${getDateString(expiryDate)}. ` : '';
}

function getFirstPromotionItem(
	paperFulfilment: PaperFulfilmentOptions,
	paperProduct: PaperProductOptions,
	productPrices: ProductPrices,
): string | undefined {
	const firstPromotion =
		productPrices['United Kingdom']?.[paperFulfilment]?.[paperProduct]?.Monthly
			?.GBP?.promotions?.[0];
	if (firstPromotion) {
		return getPromotionExpiry(firstPromotion);
	}
	return undefined;
}

function getFirstPromotionList(
	paperFulfilment: PaperFulfilmentOptions,
	productPrices: ProductPrices,
	activePaperProducts: ActivePaperProductOptions[],
): JSX.Element {
	const promotionExpiryList = activePaperProducts
		.filter((paperOption) => paperOption.endsWith('Plus'))
		.map((paperOption) =>
			getFirstPromotionItem(paperFulfilment, paperOption, productPrices),
		);
	const uniquePromotionExpiryList =
		promotionExpiryList.length !== 0
			? [...new Set(promotionExpiryList)]
			: promotionExpiryList;
	return (
		<p>
			{uniquePromotionExpiryList.map((expiry, index) => (
				<div key={index}>
					{'*'.repeat(index + 1)}
					{expiry}
				</div>
			))}
		</p>
	);
}

export default function PaperPromotionTsAndCs({
	paperFulfilment,
	productPrices,
	activePaperProducts,
}: PaperTsAndCsProps): JSX.Element {
	return (
		<div css={promotionContainer}>
			{getFirstPromotionList(
				paperFulfilment,
				productPrices,
				activePaperProducts,
			)}
		</div>
	);
}
