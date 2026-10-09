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

export function getOnboardingProductTitle(
	productKey?: OnboardingProductKey,
	landingPageSettings?: LandingPageVariant,
): string {
	if (!productKey) {
		return '';
	}

	return (
		landingPageSettings?.products[productKey]?.title ??
		getProductLabel(productKey)
	);
}

export function getOnboardingProductCopy(
	productKey: OnboardingProductKey | undefined,
	landingPageSettings: LandingPageVariant | undefined,
	countryGroupId: CountryGroupId,
): { title: string; benefits: BenefitsCheckListData[] } {
	if (!productKey) {
		return { title: '', benefits: [] };
	}

	const benefits =
		getBenefitsChecklistFromLandingPageTool(
			productKey,
			landingPageSettings ?? emptyLandingPageSettings,
			countryGroupId,
		) ?? [];

	return {
		title: getOnboardingProductTitle(productKey, landingPageSettings),
		benefits,
	};
}
