import { SvgInfoRound } from '@guardian/source/react-components';
import type { CountryGroupName } from '@modules/internationalisation/countryGroup';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { PaperProductOptions } from '@modules/product/productOptions';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import { type ProductPrices } from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getDateString } from 'helpers/utilities/dateFormatting';
import type { PaperTsAndCsProps } from './PaperLandingTsAndCs';
import { promotionContainer } from './PrintPromotionStyles';

function getPromotionExpiry(promotion: Promotion): string {
	const expiryDate = promotion.expires
		? new Date(promotion.expires)
		: undefined;
	return expiryDate ? `Offer ends ${getDateString(expiryDate)}. ` : '';
}

function getFirstPromotionItem(
	country: CountryGroupName,
	paperFulfilment: PaperFulfilmentOptions,
	paperProduct: PaperProductOptions,
	productPrices: ProductPrices,
): string | undefined {
	const firstPromotion =
		productPrices[country]?.[paperFulfilment]?.[paperProduct]?.Monthly?.GBP
			?.promotions?.[0];
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
	const copyEnd = `You can cancel your subscription at any time. Sunday only subscriptions for The Observer are offered by Tortoise Media Ltd. Tortoise Media's terms and conditions and privacy policy will apply.`;
	const promotionExpiryList = activePaperProducts
		.filter((paperOption) => paperOption.endsWith('Plus'))
		.map((paperOption) =>
			getFirstPromotionItem(
				'United Kingdom',
				paperFulfilment,
				paperOption,
				productPrices,
			),
		);
	// ToDo : Unique promotionExpiryList items.
	return (
		<p>
			{promotionExpiryList}
			{copyEnd}
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
			<SvgInfoRound size="medium" />
			{getFirstPromotionList(
				paperFulfilment,
				productPrices,
				activePaperProducts,
			)}
		</div>
	);
}
