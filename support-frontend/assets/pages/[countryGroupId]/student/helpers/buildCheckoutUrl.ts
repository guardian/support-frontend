import type { CountryCode } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { Country } from 'helpers/internationalisation/classes/country';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { routes } from 'helpers/urls/routes';
import { isStudentBeansRegionValid } from 'pages/[countryGroupId]/helpers/isStudentBeansRegionValid';

export default function buildCheckoutUrl(
	supportRegionId: SupportRegionId,
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	enableStudentBeansEurope: boolean,
	promoCode?: string,
	countryOverride?: CountryCode,
): string {
	const countryCode = countryOverride ?? Country.detect();
	// For this product/rate plan we direct the user to Student Beans for verification
	if (
		productKey == 'SupporterPlus' &&
		ratePlanKey === 'OneYearStudent' &&
		isStudentBeansRegionValid(
			supportRegionId,
			countryCode,
			enableStudentBeansEurope,
		)
	) {
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
				switch (countryCode) {
					case 'DE':
						return routes.supporterPlusStudentBeansDe;
					case 'FR':
						return routes.supporterPlusStudentBeansFr;
					case 'ES':
						return routes.supporterPlusStudentBeansEs;
					case 'IE':
						return routes.supporterPlusStudentBeansIe;
					case 'NL':
						return routes.supporterPlusStudentBeansNl;
				}
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
