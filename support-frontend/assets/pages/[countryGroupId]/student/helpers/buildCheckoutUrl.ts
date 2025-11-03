import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { getFeatureFlags } from 'helpers/featureFlags';
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
			case SupportRegionId.UK:
				return routes.supporterPlusStudentBeansUk;
			case SupportRegionId.US:
				return routes.supporterPlusStudentBeansUs;
			case SupportRegionId.CA:
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
	if (getFeatureFlags().enableDigitalAccess) {
		urlSearchParams.set('enableDigitalAccess', 'true');
	}
	return `/${supportRegionId}/checkout?${urlSearchParams.toString()}`;
}
