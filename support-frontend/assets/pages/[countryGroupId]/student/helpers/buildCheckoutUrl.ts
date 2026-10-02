import type { CountryCode } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { routes } from 'helpers/urls/routes';
import { isStudentBeansRegionValid } from 'pages/[countryGroupId]/helpers/isStudentBeansRegionValid';

export const routeInclCountry = (route: string, countryCode: CountryCode) => {
	return `${route}${route.includes('?') ? '&' : '?'}country=${countryCode}`;
};

export default function buildCheckoutUrl(
	supportRegionId: SupportRegionId,
	countryCode: CountryCode,
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	promoCode?: string,
): string {
	const { enableStudentBeansEurope } = useFeatureSwitches();
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
					isStudentBeansRegionValid(
						supportRegionId,
						countryCode,
						enableStudentBeansEurope,
					)
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
