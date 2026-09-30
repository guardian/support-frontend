import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { getQueryParameter } from 'helpers/urls/url';

/**
 * Picks the promotion to apply to a rate plan from the promotions on `window.guardian.promotions`.
 * Use the one matching the `promoCode` query parameter if there is one, otherwise the first which
 * applies to the rate plan.
 */
export function getAppliedPromotion(
	promotions: PromoWithCatalogInformation[],
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): PromoWithCatalogInformation | undefined {
	const promoCodeFromQueryString = getQueryParameter('promoCode');
	const promotionsForRatePlan = promotions.filter((promotion) =>
		promotion.appliesTo.catalogRatePlans.some(
			(catalogRatePlan) =>
				catalogRatePlan.productKey === productKey &&
				catalogRatePlan.productRatePlanKey === ratePlanKey,
		),
	);
	return (
		promotionsForRatePlan.find(
			(promotion) => promotion.promoCode === promoCodeFromQueryString,
		) ?? promotionsForRatePlan[0]
	);
}
