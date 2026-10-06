import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import { getSanitisedHtml } from 'helpers/utilities/utilities';

export type LandingPageCopy = NonNullable<
	PromoWithCatalogInformation['landingPage']
>;

/**
 * Picks the landing page copy for a page from the promotions on `window.guardian.promotions`.
 * Use the copy from the promotion matching `promoCode` (eg. from the query string) if it has any,
 * otherwise the copy from the first promotion which has some.
 */
export function getLandingPageCopy(
	promotions: PromoWithCatalogInformation[],
	promoCode?: string,
): LandingPageCopy | undefined {
	const promotionsWithCopy = promotions.filter(
		(promotion) => promotion.landingPage,
	);
	return (
		promotionsWithCopy.find((promotion) => promotion.promoCode === promoCode) ??
		promotionsWithCopy[0]
	)?.landingPage;
}

export function getSanitisedLandingPageCopy(
	landingPageCopy?: LandingPageCopy,
): LandingPageCopy | undefined {
	if (!landingPageCopy) {
		return undefined;
	}

	return {
		title: landingPageCopy.title ?? '',
		description: getSanitisedHtml(landingPageCopy.description ?? ''),
		roundelHtml: getSanitisedHtml(landingPageCopy.roundelHtml ?? ''),
	};
}
