import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';

/**
 * Picks the promotion to apply to a rate plan from the promotions on `window.guardian.promotions`.
 * Use the one matching `promoCode` (eg. from the query string) if there is one, otherwise the first
 * which applies to the rate plan.
 */
export function getAppliedPromotion(
	promotions: PromoWithCatalogInformation[],
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	promoCode?: string,
): PromoWithCatalogInformation | undefined {
	const promotionsForRatePlan = promotions.filter((promotion) =>
		promotion.appliesTo.catalogRatePlans.some(
			(catalogRatePlan) =>
				catalogRatePlan.productKey === productKey &&
				catalogRatePlan.productRatePlanKey === ratePlanKey,
		),
	);
	return (
		promotionsForRatePlan.find(
			(promotion) => promotion.promoCode === promoCode,
		) ?? promotionsForRatePlan[0]
	);
}
