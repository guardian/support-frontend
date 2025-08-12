import type { ActiveProductKey, ActiveRatePlanKey } from 'helpers/productCatalog';
import type { GeoId } from 'pages/geoIdConfig';

export default function buildCheckoutUrl(
	geoId: GeoId,
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	promoCode?: string,
): string {
	const urlSearchParams = new URLSearchParams({
		product: productKey,
		ratePlan: ratePlanKey,
		backButton: 'false',
	});

	if (promoCode) {
		urlSearchParams.set('promoCode', promoCode);
	}
	return `/${geoId}/checkout?${urlSearchParams.toString()}`;
}
