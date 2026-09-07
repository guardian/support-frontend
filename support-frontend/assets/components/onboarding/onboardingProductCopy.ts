import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { BenefitsCheckListData } from 'components/checkoutBenefits/benefitsCheckList';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import { type ActiveProductKey, getProductLabel } from 'helpers/productCatalog';
import { getBenefitsChecklistFromLandingPageTool } from 'pages/[countryGroupId]/checkout/helpers/benefitsChecklist';

type OnboardingProductKey = Extract<
	ActiveProductKey,
	'SupporterPlus' | 'DigitalSubscription'
>;

const emptyLandingPageSettings: LandingPageVariant = {
	name: '',
	copy: { heading: '', subheading: '' },
	products: {},
};

export function getOnboardingProductCopy(
	productKey?: OnboardingProductKey,
	landingPageSettings?: LandingPageVariant,
	countryGroupId?: CountryGroupId,
): { title: string; benefits: BenefitsCheckListData[] } {
	if (!productKey) {
		return { title: '', benefits: [] };
	}

	const title =
		landingPageSettings?.products[productKey]?.title ??
		getProductLabel(productKey);

	const benefits = countryGroupId
		? getBenefitsChecklistFromLandingPageTool(
				productKey,
				landingPageSettings ?? emptyLandingPageSettings,
				countryGroupId,
		  ) ?? []
		: [];

	return { title, benefits };
}
