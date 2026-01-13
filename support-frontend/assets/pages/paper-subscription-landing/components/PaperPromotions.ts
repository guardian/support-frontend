import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { PaperProductOptions } from '@modules/product/productOptions';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';

export type PaperPromotion = Promotion & {
	paperFulfilment: PaperFulfilmentOptions;
	activePaperProducts: ActivePaperProductOptions[];
};

export function getPaperPromotions(
	paperFulfilment: PaperFulfilmentOptions,
	paperProduct: PaperProductOptions[],
	productPrices: ProductPrices,
): PaperPromotion[] {
	const paperPromotions = paperProduct
		.filter((paperOption) => paperOption.endsWith('Plus'))
		.reduce<PaperPromotion[]>((acc, paperOption) => {
			const promotion =
				productPrices['United Kingdom']?.[paperFulfilment]?.[paperOption]
					?.Monthly?.GBP?.promotions?.[0];
			const contains = acc.some((p) => p.promoCode === promotion?.promoCode);
			if (!promotion) {
				return acc;
			}
			if (contains) {
				acc.some(
					(p) =>
						p.promoCode === promotion.promoCode &&
						p.activePaperProducts.push(paperOption),
				);
			} else {
				acc.push({
					...promotion,
					paperFulfilment,
					activePaperProducts: [paperOption],
				});
			}
			return acc;
		}, []);
	console.log('*** paperPromotions', paperPromotions);
	return paperPromotions.flat();
}
