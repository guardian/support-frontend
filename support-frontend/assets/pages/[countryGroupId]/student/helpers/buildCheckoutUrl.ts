import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { routes } from 'helpers/urls/routes';
import type { GeoId } from 'pages/geoIdConfig';

export default function buildCheckoutUrl(
	geoId: GeoId,
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	promoCode?: string,
): string {
	// For this product/rate plan we direct the user to Student Beans for verification
	if (productKey == 'SupporterPlus' && ratePlanKey === 'OneYearStudent') {
		switch (geoId) {
			case 'uk':
				return routes.supporterPlusStudentBeansUk;
			case 'us':
				return routes.supporterPlusStudentBeansUs;
			case 'ca':
				return routes.supporterPlusStudentBeansCa;
		}
	}

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
