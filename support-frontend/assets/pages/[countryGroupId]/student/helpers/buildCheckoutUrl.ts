import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { routes } from 'helpers/urls/routes';

export default function buildCheckoutUrl(
	supportRegionId: SupportRegionId,
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	promoCode?: string,
): string {
	// For this product/rate plan we direct the user to Student Beans for verification
	if (productKey == 'SupporterPlus' && ratePlanKey === 'OneYearStudent') {
		// If the supportRegionId isn't one of these we'll fall through to linking to the
		// normal checkout page
		switch (supportRegionId) {
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
	return `/${supportRegionId}/checkout?${urlSearchParams.toString()}`;
}
