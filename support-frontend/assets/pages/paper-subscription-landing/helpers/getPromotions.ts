import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';

export type PaperPromotion = Promotion & {
	activePaperProducts: ActivePaperProductOptions[];
};

const COUNTRY = 'United Kingdom';
const CURRENCY = 'GBP';

export default function getPaperPromotions({
	activePaperProductTypes,
	productPrices,
	paperFulfilment,
}: {
	activePaperProductTypes: ActivePaperProductOptions[];
	productPrices: ProductPrices;
	paperFulfilment: PaperFulfilmentOptions;
}): PaperPromotion[] {
	const activePlusProducts = activePaperProductTypes.filter((paperOption) =>
		paperOption.endsWith('Plus'),
	);

	return activePlusProducts.reduce<PaperPromotion[]>(
		(promotions, paperOption) => {
			// To avoid multiuple promotions being added for the same promo code,
			// we only consider the first promotion for each product option
			const [firstPromotion] =
				productPrices[COUNTRY]?.[paperFulfilment]?.[paperOption]?.Monthly?.[
					CURRENCY
				]?.promotions ?? [];

			if (!firstPromotion) {
				return promotions;
			}

			const existingPromotion = promotions.find(
				(promo) => promo.promoCode === firstPromotion.promoCode,
			);

			if (existingPromotion) {
				existingPromotion.activePaperProducts.push(paperOption);
			} else {
				promotions.push({
					...firstPromotion,
					activePaperProducts: [paperOption],
				});
			}

			return promotions;
		},
		[],
	);
}
