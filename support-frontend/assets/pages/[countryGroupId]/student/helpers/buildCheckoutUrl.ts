import type { CountryCode } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { Country } from 'helpers/internationalisation/classes/country';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { routes } from 'helpers/urls/routes';
import { isStudentBeansRegionValidSwitchedOn } from 'pages/[countryGroupId]/helpers/isStudentBeansRegionValid';

export const routeInclCountry = (route: string, countryCode: CountryCode) => {
	return `${route}${route.includes('?') ? '&' : '?'}country=${countryCode}`;
};

export default function buildCheckoutUrl(
	supportRegionId: SupportRegionId,
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	promoCode?: string,
	countryOverride?: CountryCode,
): string {
	// For this product/rate plan we direct the user to Student Beans for verification
	const countryCode = countryOverride ?? Country.detect();
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
			case SupportRegionId.EU: {
				return routeInclCountry(
					isStudentBeansRegionValidSwitchedOn(supportRegionId, countryCode)
						? routes.supporterPlusStudentBeansEu
						: routes.contributeEu,
					countryCode,
				);
			}
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
